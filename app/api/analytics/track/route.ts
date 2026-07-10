import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, referrer } = body;

    const userAgent = req.headers.get("user-agent") || "";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
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
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }

    // Increment total_views in the database
    try {
      await supabase.rpc("increment_views", { row_key: "total_views" });
    } catch (err) {
      console.error("Increment views error:", err);
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

    return NextResponse.json({
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
