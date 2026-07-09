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
    <div className="flex h-full flex-col bg-neutral-950 text-neutral-200 border-r border-neutral-800">
      {/* Brand */}
      <div className="flex h-16 items-center px-6 border-b border-neutral-800">
        <Link href="/" className="font-mono text-lg font-bold text-white flex items-center gap-1.5">
          MEGP Portfolio<span className="text-sky-500">.</span>
          <span className="text-[10px] bg-neutral-800 text-sky-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-sans">
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
              className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-mono transition-all duration-200 ${
                isActive
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white border border-transparent"
              }`}
              onClick={onLinkClick}
            >
              <div className="flex items-center gap-3">
                <Icon className={`size-4 ${isActive ? "text-sky-400" : "text-neutral-500"}`} />
                {link.name}
              </div>
              {isActive && <ChevronRight className="size-3 text-sky-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950">
        <div className="flex items-center justify-between gap-4 rounded-lg bg-neutral-900/50 p-3 border border-neutral-800">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">Admin Account</p>
            <p className="truncate text-[10px] text-neutral-500 font-mono">active session</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleLogout}
            className="text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-md"
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

  // Inactivity auto logout handler
  useEffect(() => {
    if (pathname === "/admin/login") return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(logoutDueToInactivity, INACTIVITY_TIMEOUT);
    };

    const logoutDueToInactivity = async () => {
      try {
        await supabase.auth.signOut();
        toast.warning("Session expired due to inactivity. Please log in again.");
        router.push("/admin/login");
        router.refresh();
      } catch {
        // Ignored
      }
    };

    // Events that count as user activity
    const activityEvents = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];

    // Initialize timer
    resetTimer();

    // Attach listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [pathname, router, supabase]);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch {
      // Ignored
    }
  }



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
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <SidebarContent 
          pathname={pathname} 
          handleLogout={handleLogout} 
          onLinkClick={() => {}} 
        />
      </div>

      {/* Main Column */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-6 backdrop-blur-md">
          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="text-neutral-400 hover:text-white">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r border-neutral-800">
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
              <Button variant="outline" size="sm" className="text-xs font-mono">
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
