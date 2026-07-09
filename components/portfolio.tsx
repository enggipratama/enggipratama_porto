"use client";

import { motion } from "framer-motion";
import { Timeline } from "@/components/ui/timeline";
import { SectionHeader } from "@/components/ui/section-header";
import {
  PortfolioCard,
  PortfolioCard1,
  PortfolioCard2,
  PortfolioCard3,
} from "./portfolio_card/2023_2025";

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

export function TimelinePortfolio() {
  const data = [
    {
      title: "2023",
      content: <PortfolioCard1 />,
    },
    {
      title: "2024",
      content: <PortfolioCard2 />,
    },
    {
      title: "2025",
      content: <PortfolioCard3 />,
    },
    {
      title: "Coming Soon",
      content: <PortfolioCard />,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-white py-12 sm:py-16 lg:py-20 dark:bg-neutral-950">
      {/* Header */}
      <div className="px-4 text-center sm:mb-12 lg:mb-16">
        <SectionHeader
          title="Selected Works"
          subtitle="A curated collection of projects that showcase my growth as a developer"
        />
      </div>

      {/* Timeline */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative w-full px-4 sm:px-6 lg:px-8"
      >
        <Timeline data={data} />
      </motion.div>
    </section>
  );
}
