import { createSupabaseServerClient } from "@/lib/supabase-server";
import { DashboardClient } from "@/components/admin/dashboard-client";

export const revalidate = 0; // Disable cache for dashboard

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  // Fetch statistics
  const { count: totalProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: visibleProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("is_visible", true);

  const { count: hiddenProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("is_visible", false);

  const { count: totalSettings } = await supabase
    .from("site_settings")
    .select("*", { count: "exact", head: true });

  // Get last updated project
  const { data: lastUpdatedProject } = await supabase
    .from("projects")
    .select("title, updated_at")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Get last updated setting
  const { data: lastUpdatedSetting } = await supabase
    .from("site_settings")
    .select("key, updated_at")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects || 0,
      description: `${visibleProjects || 0} visible, ${hiddenProjects || 0} hidden`,
      iconName: "projects",
      color: "text-sky-400",
    },
    {
      title: "Site Settings",
      value: totalSettings || 0,
      description: "Key-value configuration items",
      iconName: "settings",
      color: "text-purple-400",
    },
    {
      title: "Visible Works",
      value: visibleProjects || 0,
      description: "Published on the timeline",
      iconName: "visible",
      color: "text-emerald-400",
    },
    {
      title: "Hidden Works",
      value: hiddenProjects || 0,
      description: "Drafts or coming soon projects",
      iconName: "hidden",
      color: "text-neutral-400",
    },
  ];

  return (
    <DashboardClient
      initialStats={stats}
      lastUpdatedProject={
        lastUpdatedProject
          ? { title: lastUpdatedProject.title, updated_at: lastUpdatedProject.updated_at }
          : null
      }
      lastUpdatedSetting={
        lastUpdatedSetting
          ? { key: lastUpdatedSetting.key, updated_at: lastUpdatedSetting.updated_at }
          : null
      }
    />
  );
}
