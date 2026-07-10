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
    const { error } = await supabase.from("visitor_logs").insert({
      ip,
      browser,
      device,
      os,
      country,
      referrer: cleanReferrer,
      path: path || "/",
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
