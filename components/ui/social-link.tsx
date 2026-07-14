"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import * as Lucide from "lucide-react";
import { cn } from "@/lib/utils";

export interface SocialLinkData {
  label: string;
  href: string;
  platform: string;
  icon?: string;
  color?: string;
}

interface SocialLinkProps {
  link: SocialLinkData;
  variant?: "footer" | "contact";
}

export function SocialLink({ link, variant = "footer" }: SocialLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isFooter = variant === "footer";
  const baseColor = isFooter
    ? "text-neutral-500"
    : "text-neutral-700 dark:text-neutral-300";

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
    const IconComp = (Lucide.icons as Record<string, React.ComponentType<{ size?: number }>>)[link.icon];
    if (IconComp) Icon = IconComp;
  }

  const finalHref =
    link.platform === "email" && link.href && !link.href.startsWith("mailto:")
      ? `mailto:${link.href}`
      : link.href;

  const commonProps = {
    href: finalHref,
    "aria-label": link.label,
    target: "_blank" as const,
    rel: "noopener noreferrer" as const,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  if (isFooter) {
    return (
      <motion.a
        {...commonProps}
        whileHover={{ y: -3, scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={cn("transition-colors", isHovered ? activeColorClass : baseColor)}
        style={activeStyle}
      >
        <Icon size={20} />
      </motion.a>
    );
  }

  return (
    <motion.a
      {...commonProps}
      whileHover={{ y: -3, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "rounded-xl bg-neutral-100 dark:bg-neutral-800/80 p-3 transition-all hover:bg-neutral-200/60 dark:hover:bg-neutral-800/50 border border-neutral-200/40 dark:border-neutral-700/30 shadow-sm flex items-center justify-center size-10",
        isHovered ? activeColorClass : baseColor
      )}
      style={activeStyle}
    >
      <Icon size={18} />
    </motion.a>
  );
}