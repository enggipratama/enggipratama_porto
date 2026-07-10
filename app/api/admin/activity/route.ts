import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/admin-auth";
import { logActivity, type ActivityAction } from "@/lib/admin-activity";

const VALID_ACTIONS: ActivityAction[] = [
  "login",
  "logout",
  "project_create",
  "project_update",
  "project_delete",
  "settings_update",
  "backup",
  "restore",
];

// GET: Recent admin activity (newest first)
export async function GET() {
  try {
    await requireAdmin();

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("admin_activity_log")
      .select("id, action, entity, details, admin_email, created_at")
      .order("created_at", { ascending: false })
      .limit(25);

    if (error) throw error;

    return NextResponse.json({ success: true, activities: data ?? [] });
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

// POST: Record an activity from a client-side admin action (login, backup, restore)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { action, entity, details } = body;

    if (!VALID_ACTIONS.includes(action)) {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }

    await logActivity(action, entity, details);

    return NextResponse.json({ success: true });
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
