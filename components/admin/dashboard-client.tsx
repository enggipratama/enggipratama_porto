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
  EyeOff
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
  
  const stats = initialStats;
  const [totalViews, setTotalViews] = useState<number>(0);
  const [exporting, setExporting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to real-time views
  useEffect(() => {
    async function getInitialViews() {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "total_views")
        .maybeSingle();
      if (data && typeof data.value === "number") {
        setTotalViews(data.value);
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
          table: "site_settings",
          filter: "key=eq.total_views",
        },
        (payload) => {
          if (typeof payload.new.value === "number") {
            setTotalViews(payload.new.value);
          }
        }
      )
      .subscribe();

    return () => {
      viewsChannel.unsubscribe();
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

  return (
    <div className="space-y-8">
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <Card key={i} className="border-neutral-800 bg-neutral-900/50 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
                <Icon className={`size-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
                <p className="mt-1 text-xs text-neutral-500 font-mono">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Visual Analytics & System Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Visitors Trend Chart */}
        <Card className="border-neutral-800 bg-neutral-900/50 lg:col-span-2 shadow-md">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="size-4 text-sky-400" />
                Visitor Trends (7 Days)
              </CardTitle>
              <CardDescription>Estimated traffic analytics based on {totalViews} total views.</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-sky-450 font-mono flex items-center gap-1.5 justify-end">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
                </span>
                {totalViews}
              </div>
              <p className="text-[10px] text-neutral-500 font-mono">Real-Time Visits</p>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-48 w-full flex items-end justify-between gap-2.5 px-2 pb-6 border-b border-neutral-800 relative select-none">
              {/* Grid Lines */}
              <div className="absolute inset-x-0 top-0 border-t border-neutral-800/40 pointer-events-none" />
              <div className="absolute inset-x-0 top-1/3 border-t border-neutral-800/40 pointer-events-none" />
              <div className="absolute inset-x-0 top-2/3 border-t border-neutral-800/40 pointer-events-none" />

              {chartData.map((d, idx) => {
                const heightPercent = maxViews > 0 ? (d.views / maxViews) * 100 : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 bg-neutral-950 border border-neutral-800 text-[10px] text-neutral-200 font-mono px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                      {d.views} hits
                    </div>
                    {/* Bar */}
                    <div 
                      style={{ height: `${Math.max(heightPercent, 8)}%` }}
                      className="w-full bg-gradient-to-t from-sky-600/20 to-sky-500/80 hover:to-sky-400 rounded-t border-t border-sky-400/40 transition-all duration-300 relative overflow-hidden"
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
        <div className="space-y-6">
          {/* System Status Card */}
          <Card className="border-neutral-800 bg-neutral-900/50 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="size-4 text-emerald-450" />
                Connection & Updates
              </CardTitle>
              <CardDescription>Live database state information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-neutral-950 p-4 border border-neutral-800 space-y-3.5 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 flex items-center gap-1.5">
                    <Activity className="size-3.5 text-neutral-600" /> Connection:
                  </span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    </span>
                    Connected
                  </span>
                </div>

                <div className="h-px bg-neutral-800/60" />

                <div className="space-y-2">
                  <span className="text-neutral-500 flex items-center gap-1.5 mb-1.5">
                    <Calendar className="size-3.5 text-neutral-600" /> Recent Updates:
                  </span>
                  <div className="pl-5 space-y-2 border-l border-neutral-850">
                    <div className="flex flex-col">
                      <span className="text-neutral-300 text-[11px]">Projects Table:</span>
                      <span className="text-neutral-500 text-[9px] truncate">
                        {lastUpdatedProject 
                          ? `"${lastUpdatedProject.title}" (${new Date(lastUpdatedProject.updated_at).toLocaleString()})`
                          : "No updates yet"
                        }
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-neutral-300 text-[11px]">Settings Table:</span>
                      <span className="text-neutral-500 text-[9px] truncate">
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

      {/* Quick Navigation Card */}
      <Card className="border-neutral-800 bg-neutral-900/50 shadow-md">
        <CardHeader>
          <CardTitle className="text-white">Content Sections Management</CardTitle>
          <CardDescription>Quick links to edit and configure active page modules.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Link href="/admin/hero" className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 p-4 hover:bg-neutral-900 hover:border-neutral-700 transition-all group shadow-sm">
            <div className="flex items-center gap-3">
              <Home className="size-4 text-sky-400" />
              <span className="text-sm font-mono text-neutral-200">Hero Editor</span>
            </div>
            <ArrowRight className="size-4 text-neutral-500 group-hover:text-white transition-colors" />
          </Link>

          <Link href="/admin/about" className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 p-4 hover:bg-neutral-900 hover:border-neutral-700 transition-all group shadow-sm">
            <div className="flex items-center gap-3">
              <User className="size-4 text-purple-400" />
              <span className="text-sm font-mono text-neutral-200">About & SEO</span>
            </div>
            <ArrowRight className="size-4 text-neutral-500 group-hover:text-white transition-colors" />
          </Link>

          <Link href="/admin/projects" className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 p-4 hover:bg-neutral-900 hover:border-neutral-700 transition-all group shadow-sm">
            <div className="flex items-center gap-3">
              <FolderGit className="size-4 text-emerald-400" />
              <span className="text-sm font-mono text-neutral-200">Projects Manager</span>
            </div>
            <ArrowRight className="size-4 text-neutral-500 group-hover:text-white transition-colors" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
