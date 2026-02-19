"use client";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { motion } from "framer-motion";

export function TextFlip() {
  return (
    <div>
      <motion.div className="relative uppercase flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0">
        <LayoutTextFlip
          text="Welcome to"
          words={["Portfolio", "Blog", "Projects", "Articles"]}
        />
      </motion.div>
    </div>
  );
}
