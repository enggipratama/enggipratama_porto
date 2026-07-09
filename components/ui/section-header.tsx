"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  gradient?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = "center",
  gradient = false,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-8 sm:mb-10 lg:mb-12",
        align === "center" && "text-center",
        align === "left" && "text-left",
        className
      )}
    >
      <h2
        className={cn(
          "font-mono text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl",
          gradient
            ? "bg-gradient-to-r from-sky-500 to-purple-500 bg-clip-text text-transparent"
            : "text-neutral-900 dark:text-white"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <>
          <p className="mx-auto mt-2 max-w-md font-mono text-sm text-neutral-600 sm:mt-3 sm:text-base dark:text-neutral-300">
            {subtitle}
          </p>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-sky-500 to-purple-500 sm:mt-4 sm:w-20" />
        </>
      )}
    </motion.div>
  );
}
