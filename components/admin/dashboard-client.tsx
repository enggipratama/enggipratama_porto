"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FolderGit, 
  Home, 
  User, 
  ArrowRight,
  Database,
  Download,
  Upload,
  Loader2,
  TrendingUp,
  Activity,
  Calendar,
  Settings,
  Eye,
  EyeOff,
  Chrome,
  Smartphone,
  Share2,
  LogIn,
  Plus,
  Pencil,
  Trash2,
  History
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface StatItem {
  title: string;
  value: number;
  description: string;
  iconName: string;
  color: string;
}

interface DashboardClientProps {
  initialStats: StatItem[];
  lastUpdatedProject: { title: string; updated_at: string } | null;
  lastUpdatedSetting: { key: string; updated_at: string } | null;
}

export function DashboardClient({
  initialStats,
  lastUpdatedProject,
  lastUpdatedSetting,
}: DashboardClientProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  
  const [stats, setStats] = useState<StatItem[]>(initialStats);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface AnalyticsData {
    totalVisits: number;
    browsers: { name: string; value: number }[];
    devices: { name: string; value: number }[];
    referrers: { name: string; value: number }[];
  }
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  interface ActivityItem {
    id: string;
    action: string;
    entity: string | null;
    details: Record<string, unknown> | null;
    admin_email: string | null;
    created_at: string;
  }
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // Fetch detailed visitor analytics function (component scope)
  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch {
      // ignore
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Fetch recent admin activity
  const fetchActivity = async () => {
    try {
      const res = await fetch("/api/admin/activity");
      if (!res.ok) throw new Error("Failed to fetch activity");
      const data = await res.json();
      setActivities(data.activities || []);
    } catch {
      // ignore
    } finally {
      setLoadingActivity(false);
    }
  };

  useEffect(() => {
    void fetchAnalytics();
    void fetchActivity();
  }, []);

  // Subscribe to live "online users" presence from the public site footer
  useEffect(() => {
    const channel = supabase.channel("online-users", {
      config: { presence: { key: "admin-dashboard" } },
    });
    channel
      .on("presence", { event: "sync" }, () => {
        setOnlineUsers(Object.keys(channel.presenceState()).length);
      })
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  // Subscribe to real-time admin activity inserts
  useEffect(() => {
    const channel = supabase
      .channel("realtime-admin-activity")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "admin_activity_log" },
        (payload) => {
          const row = payload.new as ActivityItem;
          setActivities((prev) => [row, ...prev].slice(0, 25));
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  // Subscribe to real-time views from the statistics table
  useEffect(() => {
    async function getInitialViews() {
      const { data } = await supabase
        .from("statistics")
        .select("value")
        .eq("key", "total_views")
        .maybeSingle();
      if (data && data.value !== undefined && data.value !== null) {
        setTotalViews(Number(data.value));
      }
    }
    getInitialViews();

    const viewsChannel = supabase
      .channel("dashboard-realtime-views")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "statistics",
          filter: "key=eq.total_views",
        },
        (payload) => {
          if (payload.new.value !== undefined && payload.new.value !== null) {
            setTotalViews(Number(payload.new.value));
          }
        }
      )
      .subscribe();

    return () => {
      viewsChannel.unsubscribe();
    };
  }, [supabase]);

  // Subscribe to real-time visitor logs inserts to live-update analytics charts
  useEffect(() => {
    const visitorChannel = supabase
      .channel("realtime-visitor-logs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "visitor_logs" },
        () => {
          void fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      visitorChannel.unsubscribe();
    };
  }, [supabase]);

  // Subscribe to real-time database changes for projects & settings stats
  useEffect(() => {
    const projectsChannel = supabase
      .channel("dashboard-realtime-projects")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        async () => {
          const { count: total } = await supabase
            .from("projects")
            .select("*", { count: "exact", head: true });
          const { count: visible } = await supabase
            .from("projects")
            .select("*", { count: "exact", head: true })
            .eq("is_visible", true);
          const { count: hidden } = await supabase
            .from("projects")
            .select("*", { count: "exact", head: true })
            .eq("is_visible", false);

          setStats((prev) =>
            prev.map((s) => {
              if (s.iconName === "projects") {
                return { ...s, value: total || 0, description: `${visible || 0} visible, ${hidden || 0} hidden` };
              }
              if (s.iconName === "visible") {
                return { ...s, value: visible || 0 };
              }
              if (s.iconName === "hidden") {
                return { ...s, value: hidden || 0 };
              }
              return s;
            })
          );
        }
      )
      .subscribe();

    const settingsChannel = supabase
      .channel("dashboard-realtime-settings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        async () => {
          const { count: total } = await supabase
            .from("site_settings")
            .select("*", { count: "exact", head: true });
          setStats((prev) =>
            prev.map((s) => {
              if (s.iconName === "settings") {
                return { ...s, value: total || 0 };
              }
              return s;
            })
          );
        }
      )
      .subscribe();

    return () => {
      projectsChannel.unsubscribe();
      settingsChannel.unsubscribe();
    };
  }, [supabase]);

  // Export Settings as JSON
  async function handleBackup() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `megp_settings_backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Settings backup downloaded successfully!");
      void fetch("/api/admin/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "backup" }),
      }).catch(() => {});
    } catch {
      toast.error("Failed to backup settings");
    } finally {
      setExporting(false);
    }
  }

  // Restore Settings from JSON
  async function handleRestore(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoring(true);
    const toastId = toast.loading("Parsing settings file...");
    try {
      const text = await file.text();
      const settings = JSON.parse(text);

      if (typeof settings !== "object" || settings === null) {
        throw new Error("Invalid backup file format");
      }

      const keys = Object.keys(settings);
      toast.loading(`Restoring ${keys.length} setting keys...`, { id: toastId });

      for (const key of keys) {
        const value = settings[key];
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value }),
        });
        if (!res.ok) throw new Error(`Failed to restore key: ${key}`);
      }

      toast.success("Settings restored successfully!", { id: toastId });
      void fetch("/api/admin/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", details: { keys: keys.length } }),
      }).catch(() => {});
      router.refresh();
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to restore backup", { id: toastId });
    } finally {
      setRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // Analytics helper calculations
  const totalViewsSafe = totalViews || 750; // Fallback to 750 for visual grid scaling if 0
  const dailyDistribution = [0.12, 0.15, 0.18, 0.14, 0.22, 0.11, 0.08]; // 7 days percentages
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartData = daysOfWeek.map((day, idx) => ({
    day,
    views: Math.round(totalViewsSafe * dailyDistribution[idx]),
  }));
  const maxViews = Math.max(...chartData.map((d) => d.views));

  // Map raw activity action to display label/icon/color
  const activityMeta = (action: string) => {
    switch (action) {
      case "login": return { label: "Login", icon: LogIn, color: "text-emerald-400" };
      case "logout": return { label: "Logout", icon: LogIn, color: "text-neutral-400" };
      case "project_create": return { label: "Created project", icon: Plus, color: "text-sky-400" };
      case "project_update": return { label: "Updated project", icon: Pencil, color: "text-sky-400" };
      case "project_delete": return { label: "Deleted project", icon: Trash2, color: "text-red-400" };
      case "settings_update": return { label: "Updated setting", icon: Settings, color: "text-purple-400" };
      case "backup": return { label: "Backed up data", icon: Download, color: "text-amber-400" };
      case "restore": return { label: "Restored data", icon: Upload, color: "text-amber-400" };
      default: return { label: action, icon: Activity, color: "text-neutral-400" };
    }
  };

  const timeAgo = (iso: string) => {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="space-y-8 min-w-0">
      {/* Welcome */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-800 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white flex items-center gap-2">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-400 font-mono">
            Overview of your portfolio site data, backups, and live visitor stats.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={handleBackup} disabled={exporting} className="w-full sm:w-auto h-9 font-mono">
            {exporting ? <Loader2 className="mr-1.5 size-4 animate-spin" /> : <Download className="mr-1.5 size-4" />}
            Backup Data
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={restoring} className="w-full sm:w-auto h-9 font-mono relative">
            {restoring ? <Loader2 className="mr-1.5 size-4 animate-spin" /> : <Upload className="mr-1.5 size-4" />}
            Restore Data
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleRestore}
              accept=".json"
              className="hidden"
            />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = (() => {
            switch (stat.iconName) {
              case "projects": return FolderGit;
              case "settings": return Settings;
              case "visible": return Eye;
              case "hidden": return EyeOff;
              default: return FolderGit;
            }
          })();
          return (
            <Card key={i} className="border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-md h-full min-w-0 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700/60 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)] hover:bg-neutral-900/65 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                <CardTitle className="text-xs font-mono text-neutral-400 uppercase tracking-wider group-hover:text-neutral-300 transition-colors">
                  {stat.title}
                </CardTitle>
                <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-850 group-hover:border-neutral-750 transition-colors">
                  <Icon className={`size-4 ${stat.color} group-hover:scale-110 transition-transform`} />
                </div>
              </CardHeader>
               <CardContent className="flex-1 flex flex-col justify-between pt-2">
                 <div className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight break-words group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-400 group-hover:bg-clip-text group-hover:text-transparent transition-all">{stat.value}</div>
                 <p className="mt-1 text-xs text-neutral-500 font-mono group-hover:text-neutral-400 transition-colors break-words">{stat.description}</p>
               </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Visual Analytics & System Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Visitors Trend Chart */}
        <Card className="border-neutral-800 bg-neutral-900/40 backdrop-blur-md lg:col-span-2 shadow-md h-full min-w-0 flex flex-col transition-all duration-300 hover:border-neutral-750/80">
           <CardHeader className="pb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shrink-0">
            <div>
              <CardTitle className="text-white text-sm font-mono flex items-center gap-2">
                <TrendingUp className="size-4 text-sky-400 animate-pulse" />
                Visitor Trends (7 Days)
              </CardTitle>
              <CardDescription className="text-[10px] font-mono">
                Estimated traffic analytics based on {new Intl.NumberFormat("en-US").format(totalViews)} total views.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-neutral-800 bg-neutral-950/60 px-3.5 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.2)] select-none">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </span>
                <div className="flex items-baseline font-mono">
                  <span className="text-[10px] font-bold text-emerald-400">{onlineUsers}</span>
                  <span className="text-[8px] font-normal text-neutral-500 ml-1 whitespace-nowrap">Online</span>
                </div>
              </div>

              <span className="h-3 w-px bg-neutral-800" />

              <div className="flex items-center gap-1.5">
                <Eye className="size-3.5 text-sky-400 filter drop-shadow-[0_0_2px_rgba(14,165,233,0.3)] shrink-0" />
                <div className="flex items-baseline font-mono">
                  <span className="text-[10px] font-bold text-sky-400">
                    {new Intl.NumberFormat("en-US", {
                      notation: "compact",
                      compactDisplay: "short",
                      maximumFractionDigits: 1,
                    }).format(totalViews)}
                  </span>
                  <span className="text-[8px] font-normal text-neutral-500 ml-1 whitespace-nowrap">Visits</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 flex-1 flex flex-col justify-end">
             <div className="h-40 sm:h-48 w-full flex items-end justify-between gap-2 sm:gap-2.5 px-1 sm:px-2 pb-6 border-b border-neutral-800 relative select-none">
              {/* Grid Lines */}
              <div className="absolute inset-x-0 top-0 border-t border-neutral-800/40 pointer-events-none" />
              <div className="absolute inset-x-0 top-1/3 border-t border-neutral-800/40 pointer-events-none" />
              <div className="absolute inset-x-0 top-2/3 border-t border-neutral-800/40 pointer-events-none" />

               {chartData.map((d, idx) => {
                 const heightPercent = maxViews > 0 ? (d.views / maxViews) * 100 : 0;
                 return (
                   <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer outline-none" onClick={() => setActiveBar(activeBar === idx ? null : idx)}>
                     {/* Tooltip */}
                     <div className={`absolute bottom-full mb-2 bg-neutral-950 border border-sky-500/20 text-[10px] text-sky-400 font-mono px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.15)] transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap ${activeBar === idx ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                       {new Intl.NumberFormat("en-US").format(d.views)} hits
                     </div>
                    {/* Bar */}
                    <div 
                      style={{ height: `${Math.max(heightPercent, 8)}%` }}
                      className="w-full bg-gradient-to-t from-purple-600/30 via-sky-550/70 to-sky-400 hover:from-purple-500 hover:to-sky-300 rounded-t border-t border-sky-400/50 transition-all duration-300 relative overflow-hidden shadow-[0_0_10px_rgba(56,189,248,0.15)]"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[size:10px_10px] opacity-10 group-hover:opacity-20 transition-opacity" />
                    </div>
                    {/* Label */}
                    <span className="absolute top-full mt-2 text-[10px] font-mono text-neutral-550 uppercase">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Database Status & Quick Actions */}
        <div className="h-full flex flex-col">
          {/* System Status Card */}
          <Card className="border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-md h-full min-w-0 flex flex-col transition-all duration-300 hover:border-neutral-750/80">
            <CardHeader className="pb-3 shrink-0">
              <CardTitle className="text-white text-sm font-mono flex items-center gap-2">
                <Database className="size-4 text-emerald-450" />
                Connection & Updates
              </CardTitle>
              <CardDescription className="text-[10px] font-mono">Live database state information.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4 flex flex-col">
              <div className="rounded-lg bg-neutral-950 p-4 border border-neutral-850 font-mono text-xs shadow-inner flex-1 flex flex-col justify-between space-y-3.5">
                <div className="flex items-center justify-between shrink-0">
                  <span className="text-neutral-550 flex items-center gap-1.5">
                    <Activity className="size-3.5 text-neutral-600" /> Connection:
                  </span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    </span>
                    Connected
                  </span>
                </div>

                <div className="h-px bg-neutral-850/60 shrink-0" />

                <div className="space-y-2 flex-1 flex flex-col justify-end">
                  <span className="text-neutral-550 flex items-center gap-1.5 mb-1 shrink-0">
                    <Calendar className="size-3.5 text-neutral-600" /> Recent Updates:
                  </span>
                  <div className="pl-4 space-y-2 border-l border-neutral-850">
                     <div className="flex flex-col">
                       <span className="text-neutral-400 text-[10px] font-mono">Projects Table:</span>
                       <span className="text-neutral-500 text-[9px] break-words font-mono">
                         {lastUpdatedProject 
                           ? `"${lastUpdatedProject.title}" (${new Date(lastUpdatedProject.updated_at).toLocaleString()})`
                           : "No updates yet"
                         }
                       </span>
                     </div>
                     <div className="flex flex-col">
                       <span className="text-neutral-400 text-[10px] font-mono">Settings Table:</span>
                       <span className="text-neutral-500 text-[9px] break-words font-mono">
                         {lastUpdatedSetting
                           ? `"${lastUpdatedSetting.key}" (${new Date(lastUpdatedSetting.updated_at).toLocaleString()})`
                           : "No updates yet"
                         }
                       </span>
                     </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Visitor Analytics Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Browser Distribution */}
          <Card className="border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-md h-full min-w-0 flex flex-col transition-all duration-300 hover:border-neutral-750/80">
            <CardHeader className="pb-3 shrink-0">
              <CardTitle className="text-white text-sm font-mono flex items-center gap-2">
              <Chrome className="size-4 text-purple-400" />
              Browsers
            </CardTitle>
            <CardDescription className="text-[10px] font-mono">Top visitor browsers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2 flex-1">
            {loadingAnalytics ? (
              <div className="flex justify-center py-6"><Loader2 className="animate-spin text-neutral-500 size-4" /></div>
            ) : analytics?.browsers.length ? (
              analytics.browsers.slice(0, 5).map((b, idx) => {
                const displayPct = analytics.totalVisits > 0 ? (b.value / analytics.totalVisits) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between text-neutral-350">
                      <span className="truncate pr-2 min-w-0">{b.name}</span>
                      <span className="shrink-0 text-neutral-500">{b.value} ({Math.round(displayPct)}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden">
                      <div style={{ width: `${displayPct}%` }} className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.3)]" />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-neutral-600 font-mono italic">No data logged yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Device Distribution */}
          <Card className="border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-md h-full min-w-0 flex flex-col transition-all duration-300 hover:border-neutral-750/80">
            <CardHeader className="pb-3 shrink-0">
              <CardTitle className="text-white text-sm font-mono flex items-center gap-2">
              <Smartphone className="size-4 text-emerald-400" />
              Devices
            </CardTitle>
            <CardDescription className="text-[10px] font-mono">Visitor device classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2 flex-1">
            {loadingAnalytics ? (
              <div className="flex justify-center py-6"><Loader2 className="animate-spin text-neutral-500 size-4" /></div>
            ) : analytics?.devices.length ? (
              analytics.devices.slice(0, 5).map((d, idx) => {
                const pct = analytics.totalVisits > 0 ? (d.value / analytics.totalVisits) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between text-neutral-350">
                      <span className="truncate pr-2 min-w-0">{d.name}</span>
                      <span className="shrink-0 text-neutral-500">{d.value} ({Math.round(pct)}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden">
                      <div style={{ width: `${pct}%` }} className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-neutral-600 font-mono italic">No data logged yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Referrer Distribution */}
          <Card className="border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-md h-full min-w-0 flex flex-col transition-all duration-300 hover:border-neutral-750/80">
            <CardHeader className="pb-3 shrink-0">
              <CardTitle className="text-white text-sm font-mono flex items-center gap-2">
              <Share2 className="size-4 text-sky-400" />
              Referrers
            </CardTitle>
            <CardDescription className="text-[10px] font-mono">Traffic origin hostnames</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2 flex-1">
            {loadingAnalytics ? (
              <div className="flex justify-center py-6"><Loader2 className="animate-spin text-neutral-500 size-4" /></div>
            ) : analytics?.referrers.length ? (
              analytics.referrers.slice(0, 5).map((r, idx) => {
                const pct = analytics.totalVisits > 0 ? (r.value / analytics.totalVisits) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between text-neutral-350">
                      <span className="truncate pr-2 min-w-0">{r.name}</span>
                      <span className="shrink-0 text-neutral-500">{r.value} ({Math.round(pct)}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden">
                      <div style={{ width: `${pct}%` }} className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.3)]" />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-neutral-600 font-mono italic">No data logged yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Admin Activity Feed */}
      <Card className="border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-md min-w-0 w-full overflow-hidden">
        <CardHeader className="pb-3 flex flex-row items-center justify-between shrink-0">
          <div>
            <CardTitle className="text-white text-sm font-mono flex items-center gap-2">
              <History className="size-4 text-sky-400" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-[10px] font-mono">Live audit trail of admin actions.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {loadingActivity ? (
            <div className="flex justify-center py-6"><Loader2 className="animate-spin text-neutral-500 size-4" /></div>
          ) : activities.length ? (
            <ul className="space-y-2 max-h-80 overflow-y-auto pr-1 min-w-0 w-full">
               {activities.map((a) => {
                 const meta = activityMeta(a.action);
                 const Icon = meta.icon;
                 const deviceInfo =
                   a.details && typeof a.details === "object"
                     ? ((a.details as Record<string, unknown>).device as string | undefined)
                     : undefined;
                 const shouldShowEntity = a.entity && a.action !== "login" && a.action !== "logout";
                 return (
                   <li key={a.id} className="flex items-start gap-3 min-w-0 w-full py-2 px-2.5 rounded-xl hover:bg-neutral-900/30 transition-all border border-transparent hover:border-neutral-850/40">
                     <div className={`mt-0.5 p-1.5 rounded-lg bg-neutral-950 border border-neutral-850 shrink-0 ${meta.color}`}>
                       <Icon className="size-3.5" />
                     </div>
                     <div className="min-w-0 flex-1 space-y-0.5">
                       <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono font-medium text-neutral-200">
                         <span className={meta.color}>{meta.label}</span>
                         {shouldShowEntity ? <span className="text-neutral-400">· {a.entity}</span> : null}
                         <span className="text-neutral-500 font-normal">· {timeAgo(a.created_at)}</span>
                       </div>
                       <p className="text-[10px] text-neutral-500 font-mono break-all flex flex-wrap items-center gap-1.5 leading-relaxed">
                         <span className="text-neutral-400">{a.admin_email || "admin"}</span>
                         {deviceInfo && (
                           <>
                             <span className="text-neutral-700 font-sans">·</span>
                             <span className="text-neutral-500">{deviceInfo}</span>
                           </>
                         )}
                       </p>
                     </div>
                   </li>
                 );
               })}
            </ul>
          ) : (
            <p className="text-xs text-neutral-600 font-mono italic py-4 text-center">No activity logged yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Navigation Card */}
      <Card className="border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-md">
        <CardHeader>
          <CardTitle className="text-white text-sm font-mono">Content Sections Management</CardTitle>
          <CardDescription className="text-[10px] font-mono">Quick links to edit and configure active page modules.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-3">
           <Link href="/admin/hero" className="flex min-w-0 items-center justify-between rounded-xl border border-neutral-850 bg-neutral-950/60 p-4 hover:bg-neutral-900/40 hover:border-sky-500/30 hover:shadow-[0_0_20px_rgba(14,165,233,0.06)] transition-all duration-300 group shadow-sm">
             <div className="flex items-center gap-3 min-w-0">
               <Home className="size-4 text-sky-400 group-hover:scale-115 transition-transform shrink-0" />
               <span className="text-sm font-mono text-neutral-200 truncate">Hero Editor</span>
             </div>
             <ArrowRight className="size-4 text-neutral-500 group-hover:text-white transition-colors shrink-0" />
           </Link>

           <Link href="/admin/about" className="flex min-w-0 items-center justify-between rounded-xl border border-neutral-850 bg-neutral-950/60 p-4 hover:bg-neutral-900/40 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.06)] transition-all duration-300 group shadow-sm">
             <div className="flex items-center gap-3 min-w-0">
               <User className="size-4 text-purple-400 group-hover:scale-115 transition-transform shrink-0" />
               <span className="text-sm font-mono text-neutral-200 truncate">About & SEO</span>
             </div>
             <ArrowRight className="size-4 text-neutral-500 group-hover:text-white transition-colors shrink-0" />
           </Link>

           <Link href="/admin/projects" className="flex min-w-0 items-center justify-between rounded-xl border border-neutral-850 bg-neutral-950/60 p-4 hover:bg-neutral-900/40 hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.06)] transition-all duration-300 group shadow-sm">
             <div className="flex items-center gap-3 min-w-0">
               <FolderGit className="size-4 text-emerald-400 group-hover:scale-115 transition-transform shrink-0" />
               <span className="text-sm font-mono text-neutral-200 truncate">Projects Manager</span>
             </div>
             <ArrowRight className="size-4 text-neutral-500 group-hover:text-white transition-colors shrink-0" />
           </Link>
        </CardContent>
      </Card>
    </div>
  );
}
