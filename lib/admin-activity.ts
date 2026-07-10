import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getAdminUser } from "@/lib/admin-auth";

export type ActivityAction =
  | "login"
  | "logout"
  | "project_create"
  | "project_update"
  | "project_delete"
  | "settings_update"
  | "backup"
  | "restore";

/**
 * Records an admin action to the audit log.
 * Best-effort: never throws, so a logging failure can't break the primary action.
 */
export async function logActivity(
  action: ActivityAction,
  entity?: string,
  details?: Record<string, unknown>
) {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await getAdminUser();
    await supabase.from("admin_activity_log").insert({
      action,
      entity: entity ?? null,
      details: details ?? null,
      admin_email: user?.email ?? null,
    });
  } catch {
    // Logging must never break the primary action
  }
}
