"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const badgeBaseStyle = "inline-flex shrink-0 items-center rounded-md px-2 py-1 text-[10px] font-medium sm:rounded-full sm:px-2.5 sm:text-xs";

export function OpenToWorkBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className={`${badgeBaseStyle} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300`}
    >
      <span className="relative flex h-2 w-2 mr-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
      </span>
      Available for Opportunities
    </motion.div>
  );
}

export function CTAButtons() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="mt-8 flex flex-col items-center justify-center gap-3 font-sans sm:flex-row sm:gap-4"
    >
      <Link href="/contact">
        <motion.button
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 30px -10px rgba(14, 165, 233, 0.5)"
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all dark:from-white dark:via-neutral-200 dark:to-white dark:text-neutral-900 dark:shadow-neutral-800/50"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          
          <span className="relative">Let&apos;s Talk</span>
          <motion.span 
            className="relative"
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            →
          </motion.span>
        </motion.button>
      </Link>
      
      <a href="#portfolio">
        <motion.button
          whileHover={{ 
            scale: 1.05,
            borderColor: "rgba(14, 165, 233, 0.5)",
            boxShadow: "0 0 20px -5px rgba(14, 165, 233, 0.3)"
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="group relative inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white/80 px-6 py-2.5 text-sm font-medium text-neutral-700 backdrop-blur-sm transition-all hover:bg-white hover:text-sky-600 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-300 dark:hover:border-sky-500/50 dark:hover:bg-neutral-800 dark:hover:text-sky-400"
        >
          <span>Explore My Work</span>
          <motion.span 
            className="relative"
            initial={{ y: 0 }}
            whileHover={{ y: 3 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            ↓
          </motion.span>
        </motion.button>
      </a>
    </motion.div>
  );
}
