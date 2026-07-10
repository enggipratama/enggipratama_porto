"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Lucide from "lucide-react";
import Link from "next/link";
import pkg from "@/package.json";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

interface FooterSocialLinkProps {
  label: string;
  href: string;
  platform: string;
  icon?: string;
  color?: string;
}

function FooterSocialLink({ link }: { link: FooterSocialLinkProps }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseColor = "text-neutral-500";
  
  let activeColorClass = "";
  let activeStyle: React.CSSProperties = {};
  
  if (isHovered) {
    if (link.platform === "github") {
      activeColorClass = "text-neutral-900 dark:text-white";
    } else if (link.platform === "linkedin") {
      activeColorClass = "text-blue-600 dark:text-blue-400";
    } else if (link.platform === "instagram") {
      activeColorClass = "text-pink-600 dark:text-pink-400";
    } else if (link.platform === "email") {
      activeColorClass = "text-sky-500 dark:text-sky-400";
    } else if (link.color) {
      activeStyle = { color: link.color };
    } else {
      activeColorClass = "text-sky-500 dark:text-sky-400";
    }
  }
  
  let Icon: React.ComponentType<{ size?: number }> = Lucide.Globe;
  if (link.platform === "github") Icon = Lucide.Github;
  else if (link.platform === "linkedin") Icon = Lucide.Linkedin;
  else if (link.platform === "instagram") Icon = Lucide.Instagram;
  else if (link.platform === "email") Icon = Lucide.Mail;
  else if (link.icon) {
    const IconComp = (Lucide as unknown as Record<string, React.ComponentType<{ size?: number }>>)[link.icon];
    if (IconComp) Icon = IconComp;
  }
  
  const finalHref = link.platform === "email" && link.href && !link.href.startsWith("mailto:")
    ? `mailto:${link.href}`
    : link.href;
    
  return (
    <motion.a
      href={finalHref}
      aria-label={link.label}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -3, scale: 1.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("transition-colors", isHovered ? activeColorClass : baseColor)}
      style={activeStyle}
    >
      <Icon size={20} />
    </motion.a>
  );
}

const DEFAULT_SOCIAL_LINKS = [
  { label: "Github", href: "https://github.com/enggipratama", platform: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/enggipratama", platform: "linkedin" },
  { label: "Instagram", href: "https://instagram.com/enggiipratama", platform: "instagram" },
  { label: "Email", href: "mailto:work.enggipratama@gmail.com", platform: "email" },
];

const NUMBER_VARIANTS = {
  initial: { y: 15, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -15, opacity: 0 },
  transition: { type: "spring", stiffness: 300, damping: 30 },
};

function AnimatedNumber({ value }: { value: string | number }) {
  return (
    <span className="inline-flex h-full overflow-hidden relative w-auto min-w-[1ch] justify-center mx-2">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          variants={NUMBER_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute"
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <span className="invisible">{value}</span>
    </span>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [totalViews, setTotalViews] = useState<number | null>(null);
  const [tagline, setTagline] = useState("Feel free to reach out. — Say hello anytime!");
  const [footerName, setFooterName] = useState("Enggi Pratama");
  const [footerCredit, setFooterCredit] = useState("Enggi Pratama");
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL_LINKS);

  useEffect(() => {
    const initStats = async () => {
      await supabase.rpc("increment_views", { row_key: "total_views" });
      const { data } = await supabase
        .from("statistics")
        .select("value")
        .eq("key", "total_views")
        .single();
      if (data) setTotalViews(data.value);

      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: window.location.pathname,
            referrer: document.referrer,
          }),
        });
      } catch {
        // ignore tracking failures
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

    const sessionId = Math.random().toString(36).substring(2, 15);
    const presenceChannel = supabase.channel("online-users", {
      config: { presence: { key: sessionId } },
    });

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        setOnlineUsers(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({ online_at: new Date().toISOString() });
        }
      });

    const viewsChannel = supabase
      .channel("views-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "statistics",
          filter: "key=eq.total_views",
        },
        (payload) => setTotalViews(payload.new.value)
      )
      .subscribe();

    return () => {
      presenceChannel.unsubscribe();
      viewsChannel.unsubscribe();
    };
  }, []);

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
                <FooterSocialLink key={link.label} link={link} />
              ))}
            </div>

            <div className="flex items-center gap-3 text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <p className="text-[10px] font-mono tracking-widest flex items-center">
                  <AnimatedNumber
                    value={COMPACT_NUMBER_FORMATTER.format(onlineUsers)}
                  />
                  {onlineUsers <= 1 ? "User" : "Users"} Live
                </p>
              </div>

              <span className="text-neutral-300 dark:text-neutral-800">|</span>

              <div className="flex items-center gap-2">
                <Lucide.Eye size={12} className="text-sky-500" />
                <p className="text-[10px] font-mono tracking-widest flex items-center">
                  <AnimatedNumber
                    value={
                      totalViews !== null
                        ? COMPACT_NUMBER_FORMATTER.format(totalViews)
                        : "---"
                    }
                  />
                  Views
                </p>
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
