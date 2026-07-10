"use client";

import { motion } from "framer-motion";
import { TextFlip } from "@/components/text-flip";
import { OpenToWorkBadge, CTAButtons } from "@/components/hero-badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.15,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "tween" as const,
      ease: [0.16, 1, 0.3, 1] as const, // iOS custom ease-out
      duration: 1.2
    }
  }
};

import { SiteSettings } from "@/lib/data";

interface HeroContentProps {
  settings?: SiteSettings;
}

export function HeroContent({ settings }: HeroContentProps) {
  const name = settings?.hero_name || "Enggi Pratama";
  const tagline = settings?.hero_tagline || "Transforming complex problems into elegant solutions, one line of code at a time.";
  const badgeText = settings?.hero_badge_text || "Available for Opportunities";
  const flipWords = Array.isArray(settings?.text_flip_words) 
    ? (settings.text_flip_words as string[]) 
    : undefined;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center text-center px-4"
    >
      <motion.div variants={itemVariants} className="w-full flex justify-center">
        <OpenToWorkBadge text={badgeText} />
      </motion.div>
      
      <motion.h2 
        variants={itemVariants}
        className="relative z-20 px-4 py-4 text-center font-mono font-bold tracking-tight"
      >
        <TextFlip words={flipWords} />
        <span className="mt-3 block bg-gradient-to-b from-neutral-900 to-neutral-700 bg-clip-text text-lg tracking-[0.2em] text-transparent uppercase dark:from-neutral-600 dark:to-white">
          {name}.
        </span>
      </motion.h2>
      
      <motion.p 
        variants={itemVariants}
        className="max-w-2xl text-center text-sm italic text-neutral-600 dark:text-neutral-300 sm:text-lg"
      >
        &ldquo;{tagline}&rdquo;
      </motion.p>
      
      <motion.div variants={itemVariants} className="w-full flex justify-center">
        <CTAButtons />
      </motion.div>
    </motion.div>
  );
}
