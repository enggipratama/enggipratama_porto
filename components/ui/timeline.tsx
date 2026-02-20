"use client";

import React from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  return (
    <div className="relative w-full">
      <div className="relative mx-auto max-w-5xl space-y-6 sm:space-y-8 lg:space-y-10">
        {data.map((item, index) => (
          <div key={index}>
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};
