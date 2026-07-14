"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as Lucide from "lucide-react";
import Link from "next/link";
import pkg from "@/package.json";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Badge } from "@/components/ui/badge";
import { SocialLink, type SocialLinkData } from "@/components/ui/social-link";

const DEFAULT_SOCIAL_LINKS: SocialLinkData[] = [
  { label: "Github", href: "https://github.com/enggipratama", platform: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/enggipratama", platform: "linkedin" },
  { label: "Instagram", href: "https://instagram.com/enggiipratama", platform: "instagram" },
  { label: "Email", href: "mailto:work.enggipratama@gmail.com", platform: "email" },
];

export function Footer() {
  const supabase = createSupabaseBrowserClient();
  const currentYear = new Date().getFullYear();
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [tagline, setTagline] = useState("Feel free to reach out. — Say hello anytime!");
  const [footerName, setFooterName] = useState("Enggi Pratama");
  const [footerCredit, setFooterCredit] = useState("Enggi Pratama");
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL_LINKS);

  useEffect(() => {
    const initStats = async () => {
      try {
        const res = await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: window.location.pathname,
            referrer: document.referrer,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setTotalViews(Number(data.totalViews || 0));
          setOnlineUsers(Number(data.onlineUsers || 0));
        }
      } catch (err) {
        console.error("Failed to track visits & load statistics:", err);
      }
    };

    const fetchFooterSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["footer_tagline", "footer_name", "footer_credit", "social_links"]);

        if (!error && data) {
          const taglineRow = data.find((r) => r.key === "footer_tagline");
          if (taglineRow && taglineRow.value) setTagline(taglineRow.value);

          const nameRow = data.find((r) => r.key === "footer_name");
          if (nameRow && nameRow.value) setFooterName(nameRow.value);

          const creditRow = data.find((r) => r.key === "footer_credit");
          if (creditRow && creditRow.value) setFooterCredit(creditRow.value);

          const socialsRow = data.find((r) => r.key === "social_links");
          if (socialsRow && Array.isArray(socialsRow.value)) {
            setSocialLinks(socialsRow.value);
          }
        }
      } catch {
        // Fallback to defaults
      }
    };

    initStats();
    fetchFooterSettings();

    // Subscribe to live "online users" presence
    let deviceId = typeof window !== "undefined" ? localStorage.getItem("megp_device_id") : null;
    if (!deviceId) {
      deviceId = "visitor_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      if (typeof window !== "undefined") {
        localStorage.setItem("megp_device_id", deviceId);
      }
    }
    const presenceChannel = supabase.channel("online-users", {
      config: { presence: { key: deviceId } },
    });

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        setOnlineUsers(Object.keys(presenceChannel.presenceState()).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({ online_at: new Date().toISOString() });
        }
      });

    // Subscribe to real-time views updates
    const viewsChannel = supabase
      .channel("footer-realtime-views")
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
      presenceChannel.unsubscribe();
      viewsChannel.unsubscribe();
    };
  }, [supabase]);

  return (
    <footer className="relative w-full border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-50" />

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex flex-col items-center lg:items-start group">
            <Link href="/" className="text-xl font-bold font-mono text-neutral-800 dark:text-neutral-200 tracking-tighter hover:text-sky-500 transition-colors">
              {footerName}<span className="text-sky-500">.</span>
            </Link>
            <p className="text-xs text-neutral-500 mt-1 font-mono">
              {tagline}
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end mt-2 sm:mt-0 gap-2">
            <div className="flex flex-wrap items-center gap-4">
              {socialLinks.map((link) => (
                <SocialLink key={link.label} link={link} variant="footer" />
              ))}
            </div>

            <div className="flex items-center gap-3.5 rounded-full border border-neutral-200/30 dark:border-neutral-800/40 bg-neutral-100/30 dark:bg-neutral-900/20 px-3.5 py-1.5 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] select-none">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </span>
                <span className="text-xs font-bold font-mono text-emerald-500 dark:text-emerald-400">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                    maximumFractionDigits: 1,
                  }).format(onlineUsers)}
                </span>
                <span className="text-[10px] font-normal font-mono text-neutral-500 whitespace-nowrap">
                  {onlineUsers <= 1 ? "User" : "Users"} Live
                </span>
              </div>

              <span className="h-3 w-px bg-neutral-300 dark:bg-neutral-800" />

              <div className="flex items-center gap-1.5">
                <Lucide.Eye size={12} className="text-sky-500 dark:text-sky-400 filter drop-shadow-[0_0_2px_rgba(14,165,233,0.3)] shrink-0" />
                <span className="text-xs font-bold font-mono text-sky-500 dark:text-sky-400">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                    maximumFractionDigits: 1,
                  }).format(totalViews)}
                </span>
                <span className="text-[10px] font-normal font-mono text-neutral-500 whitespace-nowrap">
                  Visits
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 pt-5">
          <p className="text-sm text-neutral-500 font-mono flex items-center gap-2 flex-wrap justify-center">
            © {currentYear} — Made with
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Lucide.Heart size={14} className="text-red-500 fill-red-500" />
            </motion.span>
            by <span className="italic">{footerCredit}</span>
          </p>
          <div className="flex items-center gap-3">
            <Badge variant="neutral">v{pkg.version}</Badge>
          </div>
        </div>
      </div>
    </footer>
  );
}