"use client";

import { motion } from "framer-motion";
import { Timeline } from "@/components/ui/timeline";
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
    <section className="relative w-full overflow-hidden bg-white py-12 sm:py-16 lg:py-20 dark:bg-black">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8 px-4 text-center sm:mb-12 lg:mb-16"
      >
        <h2 className="font-mono text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl md:text-4xl lg:text-5xl">
          Selected Works
        </h2>
        <p className="mx-auto mt-2 max-w-md font-mono text-sm text-neutral-600 sm:mt-3 sm:text-base dark:text-neutral-400">
          A curated collection of projects that showcase my growth as a developer
        </p>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-sky-500 to-purple-500 sm:mt-4 sm:w-20" />
      </motion.div>

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
