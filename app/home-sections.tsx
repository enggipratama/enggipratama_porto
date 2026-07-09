"use client";

import dynamic from "next/dynamic";
import { SkeletonCard, SkeletonStatCard, SkeletonHeatmap } from "@/components/skeleton-card";

const SpaceBackground = dynamic(
  () => import("@/components/space-background").then((m) => ({ default: m.SpaceBackground })),
  {
    ssr: false,
    loading: () => (
      <div className="relative min-h-screen w-full bg-gradient-to-b from-sky-300 via-sky-50 to-white dark:bg-black" />
    ),
  }
);

const HeroContent = dynamic(
  () => import("@/components/hero-content").then((m) => ({ default: m.HeroContent })),
  { ssr: false }
);

const ScrollIcon = dynamic(
  () => import("@/components/scroll-icon").then((m) => ({ default: m.ScrollIcon })),
  { ssr: false }
);

const SpotlightPreview = dynamic(
  () => import("@/components/about-section").then((m) => ({ default: m.SpotlightPreview })),
  { ssr: false }
);

const TimelinePortfolio = dynamic(
  () => import("@/components/portfolio").then((m) => ({ default: m.TimelinePortfolio })),
  {
    ssr: false,
    loading: () => (
      <section className="relative w-full bg-white py-12 dark:bg-black">
        <div className="mx-auto max-w-5xl space-y-6 px-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse h-40 rounded-xl bg-neutral-100 dark:bg-neutral-900" />
          ))}
        </div>
      </section>
    ),
  }
);

const GithubData = dynamic(
  () => import("@/components/github-section"),
  {
    ssr: false,
    loading: () => (
      <section className="relative w-full bg-white py-16 dark:bg-black sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-2 h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="mx-auto mt-2 h-8 w-48 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="mx-auto mt-2 h-4 w-64 rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-6">
            <div className="w-full lg:col-span-2">
              <SkeletonHeatmap />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-2 lg:grid-rows-2 lg:gap-4">
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </section>
    ),
  }
);

export default function HomeSections() {
  return (
    <main className="no-scrollbar min-h-screen overflow-y-auto scroll-smooth font-sans">
      <section id="home" className="relative min-h-screen">
        <SpaceBackground className="flex min-h-screen w-full flex-col items-center justify-center px-4">
          <HeroContent />
          <ScrollIcon />
        </SpaceBackground>
      </section>
      <section id="about" className="relative z-10 scroll-mt-10 bg-white dark:bg-black">
        <SpotlightPreview />
      </section>
      <section id="portfolio" className="scroll-mt-0">
        <TimelinePortfolio />
      </section>
      <div className="font-mono">
        <GithubData />
      </div>
    </main>
  );
}
