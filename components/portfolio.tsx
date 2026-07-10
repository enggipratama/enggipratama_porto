"use client";

import { motion } from "framer-motion";
import { Timeline } from "@/components/ui/timeline";
import { SectionHeader } from "@/components/ui/section-header";
import { Project, SiteSettings } from "@/lib/data";
import { PortfolioCardComponent } from "./portfolio_card/2023_2025";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

interface TimelinePortfolioProps {
  projects?: Project[];
  settings?: SiteSettings;
}

export function TimelinePortfolio({ projects = [], settings }: TimelinePortfolioProps) {
  const sectionTitle = settings?.portfolio_section_title || "Selected Works";
  const sectionSubtitle = settings?.portfolio_section_subtitle || "A curated collection of projects that showcase my growth as a developer";

  // Group projects by year
  const groups: Record<string, Project[]> = {};
  for (const project of projects) {
    const key = project.is_coming_soon ? "Coming Soon" : project.year;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(project);
  }

  // Sort groups: ordered dynamically by minimum sort_order of projects in the group, with "Coming Soon" at the end
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    const isSpecialA = a === "Coming Soon" || a === "TBA";
    const isSpecialB = b === "Coming Soon" || b === "TBA";
    if (isSpecialA && !isSpecialB) return 1;
    if (!isSpecialA && isSpecialB) return -1;
    if (isSpecialA && isSpecialB) return 0;
    
    const minSortA = Math.min(...groups[a].map(p => p.sort_order ?? 9999));
    const minSortB = Math.min(...groups[b].map(p => p.sort_order ?? 9999));
    return minSortA - minSortB;
  });

  const timelineData = sortedKeys.map((key) => ({
    title: key,
    content: (
      <div className="space-y-6 sm:space-y-8">
        {groups[key].map((project) => (
          <PortfolioCardComponent key={project.id} project={project} />
        ))}
      </div>
    ),
  }));

  return (
    <section className="relative w-full overflow-hidden bg-white py-12 sm:py-16 lg:py-20 dark:bg-black">
      {/* Header */}
      <div className="px-4 text-center sm:mb-12 lg:mb-16">
        <SectionHeader
          title={sectionTitle}
          subtitle={sectionSubtitle}
        />
      </div>

      {/* Timeline */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="relative w-full px-4 sm:px-6 lg:px-8"
      >
        {timelineData.length > 0 ? (
          <Timeline data={timelineData} />
        ) : (
          <div className="text-center text-neutral-500 py-12 font-mono">
            No projects found.
          </div>
        )}
      </motion.div>
    </section>
  );
}
