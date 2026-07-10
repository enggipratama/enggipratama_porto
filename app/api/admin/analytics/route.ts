import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  try {
    await requireAdmin();

    const supabase = await createSupabaseServerClient();

    // 1. Fetch total count
    const { count: totalCount, error: countError } = await supabase
      .from("visitor_logs")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    // 2. Fetch browser distribution
    const { data: browserData, error: browserError } = await supabase
      .from("visitor_logs")
      .select("browser");

    if (browserError) throw browserError;

    const browsers: Record<string, number> = {};
    browserData.forEach((row) => {
      const b = row.browser || "Other";
      browsers[b] = (browsers[b] || 0) + 1;
    });

    // 3. Fetch device distribution
    const { data: deviceData, error: deviceError } = await supabase
      .from("visitor_logs")
      .select("device");

    if (deviceError) throw deviceError;

    const devices: Record<string, number> = {};
    deviceData.forEach((row) => {
      const d = row.device || "Desktop";
      devices[d] = (devices[d] || 0) + 1;
    });

    // 4. Fetch referrer distribution
    const { data: referrerData, error: referrerError } = await supabase
      .from("visitor_logs")
      .select("referrer");

    if (referrerError) throw referrerError;

    const referrers: Record<string, number> = {};
    referrerData.forEach((row) => {
      const r = row.referrer || "Direct";
      referrers[r] = (referrers[r] || 0) + 1;
    });

    // Format distributions as arrays of objects
    const formatDist = (dist: Record<string, number>) =>
      Object.entries(dist)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    return NextResponse.json({
      success: true,
      totalVisits: totalCount || 0,
      browsers: formatDist(browsers),
      devices: formatDist(devices),
      referrers: formatDist(referrers),
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
