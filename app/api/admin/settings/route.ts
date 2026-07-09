import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/admin-auth";

// GET: Fetch all settings or specific keys via ?key=xxx
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const keys = searchParams.getAll("key");

    if (keys.length > 0) {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", keys);

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      // Convert to key-value object
      const settingsObj = data.reduce((acc: Record<string, unknown>, curr: { key: string; value: unknown }) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, unknown>);

      return NextResponse.json(settingsObj);
    }

    // Fetch all settings
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const settingsObj = data.reduce((acc: Record<string, unknown>, curr: { key: string; value: unknown }) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, unknown>);

    return NextResponse.json(settingsObj);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Update a setting { key: string, value: any }
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json(
        { success: false, error: "Missing required field: key" },
        { status: 400 }
      );
    }

    if (value === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required field: value" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("site_settings")
      .upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
