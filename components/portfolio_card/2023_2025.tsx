"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const techStackData: Record<string, "default" | "success" | "sky" | "purple" | "emerald" | "neutral" | "yellow" | "red" | "blue" | "cyan" | "indigo" | "pink"> = {
  laravel: "red",
  php: "indigo",
  mysql: "blue",
  bootstrap: "purple",
  nextjs: "neutral",
  tailwind: "cyan",
  typescript: "blue",
  framer: "pink",
  react: "sky",
};

function TechBadge({ name, tech }: { name: string; tech: string }) {
  const variant = techStackData[tech] || "default";
  
  return (
    <Badge variant={variant}>
      {name}
    </Badge>
  );
}

function CardWrapper({ children, year }: { children: React.ReactNode; year: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 1.0 }}
      className="group relative overflow-hidden rounded-xl border border-neutral-300/50 bg-neutral-50/80 p-4 shadow-lg shadow-neutral-200/40 backdrop-blur-md transition-all hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:border-sky-500/30 dark:shadow-2xl dark:shadow-black/50 dark:hover:shadow-sky-500/10 sm:rounded-2xl sm:p-5"
    >
      <div className="absolute right-3 top-3 z-10">
        <Badge variant={
          year === "2023" ? "blue" :
          year === "2024" ? "purple" :
          year === "2025" ? "success" : "neutral"
        } size="sm">
          {year}
        </Badge>
      </div>
      {children}
    </motion.div>
  );
}

function ActionButtons({ demoUrl, githubUrl }: { demoUrl?: string; githubUrl?: string }) {
  const [status, setStatus] = useState<"checking" | "up" | "down" | "maintenance">("checking");

  useEffect(() => {
    if (!demoUrl) return;

    const urlToCheck = demoUrl;
    let active = true;
    async function checkHealth() {
      try {
        const res = await fetch(`/api/health?url=${encodeURIComponent(urlToCheck)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (active) setStatus(data.status);
      } catch {
        if (active) setStatus("down");
      }
    }

    checkHealth();
    return () => {
      active = false;
    };
  }, [demoUrl]);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5 sm:gap-3">
      {demoUrl && (
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex shrink-0 items-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 px-3 py-2 text-xs font-mono font-medium text-white shadow-md transition-all hover:shadow-lg hover:shadow-sky-500/25 dark:from-white dark:via-neutral-200 dark:to-white dark:text-neutral-900 dark:hover:shadow-sky-400/25 sm:gap-2 sm:px-4 sm:text-sm"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              
              <ExternalLink className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
              <span className="relative">Live Demo</span>
            </Link>
          </motion.div>

          {/* Status Indicator Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300/40 bg-neutral-100/50 px-2 py-1 text-[10px] font-medium text-neutral-600 dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-neutral-400 select-none">
            {status === "checking" && (
              <>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-400" />
                <span className="font-mono text-[9px] uppercase tracking-wider">Checking</span>
              </>
            )}
            {status === "up" && (
              <>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Live</span>
              </>
            )}
            {status === "down" && (
              <>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500"></span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-red-600 dark:text-red-400">Offline</span>
              </>
            )}
            {status === "maintenance" && (
              <>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-amber-600 dark:text-amber-400">Maintenance</span>
              </>
            )}
          </div>
        </div>
      )}
      {githubUrl && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono font-medium text-neutral-700 shadow-sm transition-all hover:border-sky-500/50 hover:bg-white hover:text-sky-600 hover:shadow-md hover:shadow-sky-500/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-sky-400/50 dark:hover:bg-neutral-800 dark:hover:text-sky-400 sm:gap-2 sm:px-4 sm:text-sm"
          >
            <Github className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12 sm:h-4 sm:w-4" />
            <span className="relative">View Source</span>
          </Link>
        </motion.div>
      )}
    </div>
  );
}


export function PortfolioCard1() {
  const techs = [
    { name: "Laravel", tech: "laravel" },
    { name: "PHP", tech: "php" },
    { name: "MySQL", tech: "mysql" },
    { name: "Bootstrap", tech: "bootstrap" },
  ];

  return (
    <CardWrapper year="2023">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg sm:aspect-[16/10] lg:aspect-[4/3] lg:w-[45%]">
          <Image
            src="/Images/davibar.png"
            alt="Davibar House"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h3 className="pr-16 font-mono text-lg font-bold leading-tight text-neutral-900 dark:text-white sm:text-xl lg:pr-0">
            Davibar Inventory System
          </h3>
          <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
            Enterprise Warehouse Management Solution
          </p>

          <p className="mt-3 font-mono text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-sm">
            A robust inventory management system designed for Davibar House. 
            Features comprehensive stock tracking, real-time transaction monitoring, 
            automated reporting dashboards, and multi-user role management.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {techs.map((t) => (
              <TechBadge key={t.name} name={t.name} tech={t.tech} />
            ))}
          </div>

          <ActionButtons
            demoUrl="https://davibar.enggipratama.my.id"
            githubUrl="https://github.com/enggipratama/DAVIBARTEST"
          />
        </div>
      </div>
    </CardWrapper>
  );
}

export function PortfolioCard2() {
  const techs = [
    { name: "Next.js", tech: "nextjs" },
    { name: "TypeScript", tech: "typescript" },
    { name: "Tailwind", tech: "tailwind" },
  ];

  return (
    <CardWrapper year="2024">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg sm:aspect-[16/10] lg:aspect-[4/3] lg:w-[45%]">
          <Image
            src="/Images/old_portfolio.png"
            alt="Portfolio V1"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h3 className="pr-16 font-mono text-lg font-bold leading-tight text-neutral-900 dark:text-white sm:text-xl lg:pr-0">
            Personal Portfolio V1
          </h3>
          <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
            First Iteration of My Digital Presence
          </p>

          <p className="mt-3 font-mono text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-sm">
            My inaugural portfolio built with modern web technologies. 
            Features fluid animations, seamless dark mode transitions, 
            and a fully responsive layout optimized for all devices.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {techs.map((t) => (
              <TechBadge key={t.name} name={t.name} tech={t.tech} />
            ))}
          </div>

          <ActionButtons
            demoUrl="https://megp.enggipratama.my.id"
            githubUrl="https://github.com/enggipratama/porto"
          />
        </div>
      </div>
    </CardWrapper>
  );
}

export function PortfolioCard3() {
  const techs = [
    { name: "Next.js", tech: "nextjs" },
    { name: "React", tech: "react" },
    { name: "Framer", tech: "framer" },
    { name: "Tailwind", tech: "tailwind" },
  ];

  return (
    <CardWrapper year="2025">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg sm:aspect-[16/10] lg:aspect-[4/3] lg:w-[45%]">
          <Image
            src="/Images/mystery-love.png"
            alt="Mystery Love"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h3 className="pr-16 font-mono text-lg font-bold leading-tight text-neutral-900 dark:text-white sm:text-xl lg:pr-0">
            Mystery Love
          </h3>
          <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
            Interactive Celebration Experience
          </p>

          <p className="mt-3 font-mono text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-sm">
            An immersive interactive web experience crafted with meticulous attention 
            to animation detail. Leveraging Framer Motion to create memorable, 
            emotionally resonant digital moments.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {techs.map((t) => (
              <TechBadge key={t.name} name={t.name} tech={t.tech} />
            ))}
          </div>

          <ActionButtons
            demoUrl="https://bub.enggipratama.my.id"
            githubUrl="https://github.com/enggipratama/mystery-love"
          />
        </div>
      </div>
    </CardWrapper>
  );
}

export function PortfolioCard() {
  return (
    <CardWrapper year="TBA">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg sm:aspect-[16/10] lg:aspect-[4/3] lg:w-[45%]">
          <Image
            src="/Images/staytuned.png"
            alt="Coming Soon"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex shrink-0 items-center rounded-md px-3 py-1.5 text-[10px] font-bold sm:rounded-full sm:px-4 sm:text-xs bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-600 shadow-lg">
              🚧 In Development
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h3 className="pr-16 font-mono text-lg font-bold leading-tight text-neutral-900 dark:text-white sm:text-xl lg:pr-0">
            Next Big Thing
          </h3>
          <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
            Something Extraordinary is Brewing
          </p>

          <p className="mt-3 font-mono text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-sm">
            Currently architecting an ambitious project that will push the boundaries 
            of my technical capabilities. Stay tuned for a showcase of advanced 
            full-stack implementation and innovative UI/UX design.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex shrink-0 items-center rounded-md px-2 py-1 text-[10px] font-medium sm:rounded-full sm:px-2.5 sm:text-xs border border-dashed border-neutral-300 bg-transparent text-neutral-400 dark:border-neutral-700 dark:text-neutral-500">
              TBD
            </span>
            <span className="inline-flex shrink-0 items-center rounded-md px-2 py-1 text-[10px] font-medium sm:rounded-full sm:px-2.5 sm:text-xs border border-dashed border-neutral-300 bg-transparent text-neutral-400 dark:border-neutral-700 dark:text-neutral-500">
              Coming Soon
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
            <span className="inline-flex shrink-0 items-center rounded-md px-2 py-1 text-[10px] font-medium sm:rounded-full sm:px-2.5 sm:text-xs bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              Stay Tuned
            </span>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
