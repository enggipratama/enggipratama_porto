"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedTooltipPreview } from "../tooltips";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!timelineRef.current) return;

    const updateHeight = () => {
      const rect = timelineRef.current?.getBoundingClientRect();
      if (rect) setHeight(rect.height);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(timelineRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden rounded-md bg-white p-4 font-mono antialiased transition-colors duration-500 dark:bg-black/[0.96] md:min-h-[25rem] md:p-10"
    >
      <div className="mx-auto text-center mb-10 max-w-7xl px-4 md:mb-20 md:px-8 lg:px-10">
        <div className="mt-20 flex items-center sm:mt-0">
          <AnimatedTooltipPreview />
        </div>

        <h2 className="mb-4 max-w-4xl text-2xl font-bold text-black dark:text-white md:text-4xl">
          Changelog from my journey 🚀
        </h2>

        <p className="max-w-sm text-sm text-neutral-700 dark:text-neutral-300 md:max-w-none md:text-base">
          Here are the highlights of my journey as a web developer.
        </p>
      </div>

      <div ref={timelineRef} className="relative mx-auto max-w-7xl pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 first:pt-0 md:pt-20"
          >
            <div className="sticky top-40 z-40 flex max-w-xs self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md dark:bg-black">
                <div className="h-4 w-4 rounded-full border border-neutral-300 bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800" />
              </div>

              <h3 className="hidden pl-20 text-xl font-bold text-neutral-500 dark:text-neutral-500 md:block md:text-2xl">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full pl-20 pr-4 md:pl-4">
              <h3 className="mb-4 block text-left text-xl font-bold text-neutral-500 dark:text-neutral-500 md:hidden">
                {item.title}
              </h3>

              <div className="text-neutral-700 dark:text-neutral-300">
                {item.content}
              </div>
            </div>
          </div>
        ))}

        <div
          style={{ height }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent via-neutral-200 to-transparent dark:via-neutral-700 [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-blue-500 via-purple-500 to-transparent shadow-[0_0_10px_#3b82f6]"
          />
        </div>
      </div>
    </div>
  );
};
