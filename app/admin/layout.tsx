"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  User, 
  Home, 
  FolderGit, 
  LogOut, 
  Menu, 
  ChevronRight
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Hero Section", href: "/admin/hero", icon: Home },
  { name: "About Section", href: "/admin/about", icon: User },
  { name: "Projects", href: "/admin/projects", icon: FolderGit },
];

interface SidebarContentProps {
  pathname: string;
  handleLogout: () => void;
  onLinkClick: () => void;
}

function SidebarContent({ pathname, handleLogout, onLinkClick }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col bg-neutral-950/80 backdrop-blur-md text-neutral-200 border-r border-neutral-900/60 z-10">
      {/* Brand */}
      <div className="flex h-16 items-center px-6 border-b border-neutral-900/60">
        <Link href="/" className="font-mono text-base font-bold flex items-center gap-1.5">
          <span className="bg-gradient-to-r from-sky-400 via-sky-500 to-purple-400 bg-clip-text text-transparent">
            MEGP Portfolio
          </span>
          <span className="text-[9px] bg-sky-500/10 border border-sky-500/30 text-sky-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-sans font-bold">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`relative flex items-center justify-between rounded-xl px-4 py-3 text-sm font-mono transition-all duration-300 border ${
                isActive
                  ? "bg-gradient-to-r from-sky-500/10 to-purple-500/5 text-sky-400 border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.06)] font-semibold"
                  : "text-neutral-400 hover:bg-neutral-900/40 hover:text-white border-transparent"
              }`}
              onClick={onLinkClick}
            >
              <div className="flex items-center gap-3">
                <Icon className={`size-4 transition-all duration-300 ${isActive ? "text-sky-400 scale-110" : "text-neutral-500 group-hover:text-neutral-300"}`} />
                {link.name}
              </div>
              {isActive && <ChevronRight className="size-3 text-sky-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-neutral-900/60 bg-neutral-950/50">
        <div className="flex items-center justify-between gap-4 rounded-xl bg-neutral-900/30 p-3 border border-neutral-900/60 backdrop-blur-sm">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">Admin Account</p>
            <p className="truncate text-[10px] text-neutral-500 font-mono">active session</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleLogout}
            className="text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg h-8 w-8"
            title="Log Out"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createSupabaseBrowserClient();

  const handleLogout = React.useCallback(async () => {
    try {
      const localToken = localStorage.getItem("admin_session_token");
      if (localToken) {
        const { data: current } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "active_admin_session")
          .maybeSingle();

        if (current && current.value && (current.value as Record<string, string>).token === localToken) {
          await supabase
            .from("site_settings")
            .upsert({ key: "active_admin_session", value: null }, { onConflict: "key" });
        }
      }
      await supabase.auth.signOut({ scope: "local" });
      localStorage.removeItem("admin_session_token");
      void fetch("/api/admin/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      }).catch(() => {});
      router.push("/admin/login");
      router.refresh();
    } catch {
      // Ignored
    }
  }, [router, supabase]);

  // Inactivity timeout: 15 minutes
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

  // Session guard check (background check, initial load is secured by server middleware)
  useEffect(() => {
    async function checkSession() {
      if (pathname === "/admin/login") return;
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/admin/login");
        }
      } catch {
        // Ignored
      }
    }
    checkSession();
  }, [pathname, router, supabase]);

  // Active session and inactivity tracking
  useEffect(() => {
    if (pathname === "/admin/login") return;

    let timeoutId: NodeJS.Timeout;
    let hasActivity = false;
    let isInitialMount = true;
    
    const mountTimeout = setTimeout(() => {
      isInitialMount = false;
    }, 5000);

    const localToken = typeof window !== "undefined" ? localStorage.getItem("admin_session_token") : null;

    if (!localToken) {
      void handleLogout();
      return;
    }

    const resetTimer = () => {
      hasActivity = true;
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(logoutDueToInactivity, INACTIVITY_TIMEOUT);
    };

    const logoutDueToInactivity = async () => {
      if (isInitialMount) return;
      try {
        // Clear active session in DB if it matches ours
        const { data: current } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "active_admin_session")
          .maybeSingle();

        if (current && current.value && (current.value as Record<string, string>).token === localToken) {
          await supabase
            .from("site_settings")
            .upsert({ key: "active_admin_session", value: null }, { onConflict: "key" });
        }
        await supabase.auth.signOut({ scope: "local" });
        localStorage.removeItem("admin_session_token");
        toast.warning("Session expired due to inactivity. Please log in again.");
        router.push("/admin/login");
        router.refresh();
      } catch {
        // Ignored
      }
    };

    // Periodically update last_active_at in DB if there was activity, and verify token
    const runHeartbeat = async () => {
      if (isInitialMount) return;
      try {
        // 1. Verify token matches
        const { data: current, error: fetchErr } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "active_admin_session")
          .maybeSingle();

        if (fetchErr || !current || !current.value || (current.value as Record<string, string>).token !== localToken) {
          // Token mismatched or deleted! Kick out!
          await supabase.auth.signOut({ scope: "local" });
          localStorage.removeItem("admin_session_token");
          toast.error("Your session has been terminated because another admin logged in or the session expired.");
          router.push("/admin/login");
          router.refresh();
          return;
        }

        // 2. Update heartbeat if activity occurred
        if (hasActivity) {
          await supabase
            .from("site_settings")
            .upsert({
              key: "active_admin_session",
              value: { token: localToken, last_active_at: new Date().toISOString() }
            }, { onConflict: "key" });
          hasActivity = false;
        }
      } catch {
        // Ignored
      }
    };

    // Subscribe to realtime changes of active session settings for instant kickout
    const sessionChannel = supabase
      .channel("active-session-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "site_settings",
          filter: "key=eq.active_admin_session",
        },
        (payload) => {
          if (isInitialMount) return;
          const newVal = payload.new.value as Record<string, string> | null;
          if (!newVal || newVal.token !== localToken) {
            void logoutDueToInactivity();
          }
        }
      )
      .subscribe();

    // Events that count as user activity
    const activityEvents = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];

    // Initialize timer and heartbeat
    resetTimer();
    void runHeartbeat(); // run once immediately
    const heartbeatInterval = setInterval(runHeartbeat, 30 * 1000); // check/heartbeat every 30 seconds

    // Attach listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (mountTimeout) clearTimeout(mountTimeout);
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      sessionChannel.unsubscribe();
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [pathname, router, supabase, INACTIVITY_TIMEOUT, handleLogout]);



  // Skip layout for login page
  if (pathname === "/admin/login") {
    return (
      <>
        {children}
        <Toaster theme="dark" closeButton richColors />
      </>
    );
  }

  return (
    <div className="dark flex min-h-screen bg-neutral-950 text-neutral-100 relative overflow-hidden">
      {/* Background radial glows for premium modern feel */}
      <div className="pointer-events-none absolute top-0 right-0 h-[450px] w-[450px] rounded-full bg-sky-500/5 blur-[130px] z-0" />
      <div className="pointer-events-none absolute bottom-0 left-64 h-[450px] w-[450px] rounded-full bg-purple-500/5 blur-[130px] z-0" />

      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col z-20">
        <SidebarContent 
          pathname={pathname} 
          handleLogout={handleLogout} 
          onLinkClick={() => {}} 
        />
      </div>

      {/* Main Column */}
      <div className="flex flex-1 flex-col md:pl-64 relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-900/60 bg-neutral-950/70 px-6 backdrop-blur-md">
          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="text-neutral-400 hover:text-white">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r border-neutral-900/60 bg-neutral-950">
                <SidebarContent 
                  pathname={pathname} 
                  handleLogout={handleLogout} 
                  onLinkClick={() => setMobileOpen(false)} 
                />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex flex-1 items-center justify-end gap-4">
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm" className="text-xs font-mono border-neutral-850 hover:bg-neutral-900/60 hover:text-white transition-all bg-neutral-950/40 text-neutral-350 rounded-lg">
                View Live Site
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>

      <Toaster theme="dark" closeButton richColors />
    </div>
  );
}
