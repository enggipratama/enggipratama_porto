import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const analyticsSchema = z.object({
  path: z.string().min(1).max(200),
  referrer: z.string().max(500).optional().default("Direct"),
});

const TRACKED_SESSION_COOKIE = "megp_tracked_session";

function hasTrackedSession(req: NextRequest) {
  return req.cookies.get(TRACKED_SESSION_COOKIE)?.value === "true";
}

function trackedSessionCookie() {
  return `${TRACKED_SESSION_COOKIE}=true; Path=/; Max-Age=86400; SameSite=Lax`;
}

function successResponse(req: NextRequest, body: Record<string, unknown>) {
  if (hasTrackedSession(req)) {
    return NextResponse.json(body);
  }

  return NextResponse.json(body, {
    headers: {
      "Set-Cookie": trackedSessionCookie(),
    },
  });
}

function noopResponse(req: NextRequest) {
  return successResponse(req, { success: true });
}

function errorResponse(req: NextRequest, error: string, status: number) {
  if (hasTrackedSession(req)) {
    return NextResponse.json({ success: false, error }, { status });
  }

  return NextResponse.json(
    { success: false, error },
    {
      status,
      headers: {
        "Set-Cookie": trackedSessionCookie(),
      },
    }
  );
}

// ponytail: cookie-based de-dupe is per-browser and 24h only. Add server-side
// visitor fingerprint/storage when analytics accuracy matters more than simplicity.

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";

    const limitResult = rateLimit(`analytics:${ip}`, 10, 60 * 1000);
    if (!limitResult.success) return noopResponse(req);

    const body = await req.json().catch(() => ({}));
    const parsed = analyticsSchema.safeParse(body);
    if (!parsed.success) return noopResponse(req);
    const { path, referrer } = parsed.data;
    const skipLog = hasTrackedSession(req);

    const userAgent = req.headers.get("user-agent") || "";
    const country = req.headers.get("x-vercel-ip-country") || "Unknown";

    // Simple User Agent Parsing
    let browser = "Other";
    if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("SamsungBrowser")) browser = "Samsung Browser";
    else if (userAgent.includes("Opera") || userAgent.includes("OPR")) browser = "Opera";
    else if (userAgent.includes("Trident")) browser = "Internet Explorer";
    else if (userAgent.includes("Edge") || userAgent.includes("Edg")) browser = "Edge";
    else if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Safari")) browser = "Safari";

    let os = "Other";
    if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("Macintosh") || userAgent.includes("Mac OS X")) os = "macOS";
    else if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS";
    else if (userAgent.includes("Linux")) os = "Linux";

    let device = "Desktop";
    if (/Mobi|Android|iPhone|iPad|Tablet/i.test(userAgent)) {
      if (/Tablet|iPad/i.test(userAgent)) {
        device = "Tablet";
      } else {
        device = "Mobile";
      }
    }

    // Clean referrer
    let cleanReferrer = "Direct";
    if (referrer && referrer !== "") {
      try {
        const refUrl = new URL(referrer);
        cleanReferrer = refUrl.hostname || "Direct";
        if (cleanReferrer.startsWith("www.")) {
          cleanReferrer = cleanReferrer.substring(4);
        }
      } catch {
        cleanReferrer = referrer;
      }
    }

    const supabase = await createSupabaseServerClient();
    
    if (!skipLog) {
      const { error: insertError } = await supabase.from("visitor_logs").insert({
        ip,
        browser,
        device,
        os,
        country,
        referrer: cleanReferrer,
        path: path || "/",
      });

      if (insertError) {
        console.error("Analytics insert error:", insertError.message);
        return errorResponse(req, "Failed to record visit.", 500);
      }

      // Increment total_views in the database
      try {
        await supabase.rpc("increment_views", { row_key: "total_views" });
      } catch (err) {
        console.error("Increment views error:", err);
      }
    }

    // Fetch updated total views
    let totalViews = 0;
    try {
      const { data: statsData } = await supabase
        .from("statistics")
        .select("value")
        .eq("key", "total_views")
        .maybeSingle();
      if (statsData) {
        totalViews = Number(statsData.value);
      }
    } catch (err) {
      console.error("Fetch total views error:", err);
    }

    // Fetch active users in last 5 minutes
    let onlineUsers = 1;
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data: activeLogs } = await supabase
        .from("visitor_logs")
        .select("ip")
        .gt("created_at", fiveMinutesAgo);
      
      const uniqueIps = new Set(activeLogs?.map(log => log.ip) || []);
      onlineUsers = Math.max(1, uniqueIps.size);
    } catch (err) {
      console.error("Fetch active users error:", err);
    }

    return successResponse(req, {
      success: true,
      totalViews,
      onlineUsers,
    });

  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
