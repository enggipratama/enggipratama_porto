import { createSupabaseServerClient } from "@/lib/supabase-server";

/**
 * Verify the current user is the authenticated admin.
 * Returns the user if valid, null otherwise.
 */
export async function getAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && user.email !== adminEmail) return null;

  return user;
}

/**
 * Require admin authentication. Throws if not authenticated.
 */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
