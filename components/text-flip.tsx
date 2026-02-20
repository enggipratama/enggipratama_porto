"use client";

import { LayoutTextFlip } from "@/components/ui/layout-text-flip";

export function TextFlip() {
  return (
    <div className="flex flex-col items-center gap-4">
      <LayoutTextFlip 
        text="Welcome to"
        words={["Portfolio", "Blog", "Projects", "Articles"]} 
      />
    </div>
  );
}
