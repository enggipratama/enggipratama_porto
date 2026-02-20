"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";

// Tech stack data
const techStackData: Record<string, { color: string }> = {
  laravel: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
  php: { color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" },
  mysql: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  bootstrap: { color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
  nextjs: { color: "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" },
  tailwind: { color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300" },
  typescript: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  framer: { color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300" },
  react: { color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300" },
};

// Tech badge component - style standar
function TechBadge({ name, tech }: { name: string; tech: string }) {
  const data = techStackData[tech] || { color: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" };
  
  return (
    <span className={`inline-flex shrink-0 items-center rounded-md px-2 py-1 text-[10px] font-medium sm:rounded-full sm:px-2.5 sm:text-xs ${data.color}`}>
      {name}
    </span>
  );
}

// Year badge color schemes
const yearColors: Record<string, string> = {
  "2023": "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400 dark:from-blue-600 dark:to-blue-700 dark:border-blue-500",
  "2024": "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-400 dark:from-purple-600 dark:to-purple-700 dark:border-purple-500",
  "2025": "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-400 dark:from-emerald-600 dark:to-emerald-700 dark:border-emerald-500",
  "TBA": "bg-gradient-to-r from-neutral-400 to-neutral-500 text-white border-neutral-300 dark:from-neutral-600 dark:to-neutral-700 dark:border-neutral-500",
};

// Card wrapper
function CardWrapper({ children, year }: { children: React.ReactNode; year: string }) {
  const colorClass = yearColors[year] || yearColors["TBA"];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:border-sky-500/30 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-sky-500/30 sm:rounded-2xl sm:p-5"
    >
      {/* Year badge with color - style sama seperti tech stack */}
      <div className={`absolute right-3 top-3 z-10 inline-flex shrink-0 items-center rounded-md px-2 py-1 text-[10px] font-medium sm:rounded-full sm:px-2.5 sm:text-xs ${colorClass}`}>
        {year}
      </div>
      {children}
    </motion.div>
  );
}

// Action buttons with icons
function ActionButtons({ demoUrl, githubUrl }: { demoUrl?: string; githubUrl?: string }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
      {demoUrl && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex shrink-0 items-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 px-3 py-2 text-xs font-mono font-medium text-white shadow-md transition-all hover:shadow-lg hover:shadow-sky-500/25 dark:from-white dark:via-neutral-200 dark:to-white dark:text-neutral-900 dark:hover:shadow-sky-400/25 sm:gap-2 sm:px-4 sm:text-sm"
          >
            {/* Shimmer effect */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            
            <ExternalLink className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
            <span className="relative">Live Demo</span>
          </Link>
        </motion.div>
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

// Davibar - 2023
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
        {/* Image */}
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg lg:aspect-[4/3] lg:w-[45%]">
          <Image
            src="/Images/davibar.png"
            alt="Davibar House"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>

        {/* Content */}
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

          {/* Tech Stack */}
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

// Old Portfolio - 2024
export function PortfolioCard2() {
  const techs = [
    { name: "Next.js", tech: "nextjs" },
    { name: "TypeScript", tech: "typescript" },
    { name: "Tailwind", tech: "tailwind" },
  ];

  return (
    <CardWrapper year="2024">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        {/* Image */}
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg lg:aspect-[4/3] lg:w-[45%]">
          <Image
            src="/Images/old_portfolio.png"
            alt="Portfolio V1"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>

        {/* Content */}
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

          {/* Tech Stack */}
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

// Mystery Love - 2025
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
        {/* Image */}
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg lg:aspect-[4/3] lg:w-[45%]">
          <Image
            src="/Images/mystery-love.png"
            alt="Mystery Love"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>

        {/* Content */}
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

          {/* Tech Stack */}
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

// Coming Soon
export function PortfolioCard() {
  return (
    <CardWrapper year="TBA">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        {/* Image */}
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg lg:aspect-[4/3] lg:w-[45%]">
          <Image
            src="/Images/staytuned.png"
            alt="Coming Soon"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex shrink-0 items-center rounded-md px-3 py-1.5 text-[10px] font-bold sm:rounded-full sm:px-4 sm:text-xs bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-600 shadow-lg">
              🚧 In Development
            </span>
          </div>
        </div>

        {/* Content */}
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

          {/* Placeholder Tech Stack */}
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
