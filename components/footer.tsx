"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Instagram, Mail, Heart, Eye } from "lucide-react";
import pkg from "@/package.json";
import { supabase } from "@/lib/supabase";

const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

const SOCIAL_LINKS = [
  { Icon: Github, href: "https://github.com/enggipratama", label: "GitHub" },
  {
    Icon: Linkedin,
    href: "https://linkedin.com/in/enggipratama",
    label: "LinkedIn",
  },
  {
    Icon: Instagram,
    href: "https://instagram.com/enggiipratama",
    label: "Instagram",
  },
  { Icon: Mail, href: "mailto:work.enggipratama@gmail.com", label: "Email" },
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

  useEffect(() => {
    const initStats = async () => {
      await supabase.rpc("increment_views", { row_key: "total_views" });
      const { data } = await supabase
        .from("statistics")
        .select("value")
        .eq("key", "total_views")
        .single();
      if (data) setTotalViews(data.value);
    };

    initStats();

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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex flex-col items-center lg:items-start group">
            <h2 className="text-xl font-bold font-mono text-neutral-800 dark:text-neutral-200 tracking-tighter">
              Enggi Pratama<span className="text-blue-500">.</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1 font-mono">
              Feel free to reach out. — Say hello anytime!
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end mt-2 sm:mt-0 gap-2">
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="text-neutral-500 hover:text-sky-500 transition-colors"
                >
                  <Icon size={20} />
                </motion.a>
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
                <Eye size={12} className="text-blue-500" />
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
              <Heart size={14} className="text-red-500 fill-red-500" />
            </motion.span>
            by <span className="italic">Enggi Pratama</span>
          </p>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-[10px] text-neutral-500 font-mono border border-neutral-200 dark:border-neutral-800">
              v{pkg.version}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
