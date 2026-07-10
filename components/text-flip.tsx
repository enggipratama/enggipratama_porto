"use client";

import { LayoutTextFlip } from "@/components/ui/layout-text-flip";

export function TextFlip({ words }: { words?: string[] }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <LayoutTextFlip 
        text="Welcome to"
        words={words || ["Portfolio", "Blog", "Projects", "Articles"]} 
      />
    </div>
  );
}
