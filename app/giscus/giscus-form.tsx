"use client";

import { motion } from "framer-motion";
import { MessageSquare, Lightbulb, HelpCircle, Bug, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Giscus from "@/components/giscus-wrapper";
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb-giscus";

const features = [
  {
    icon: Lightbulb,
    title: "Share Ideas",
    description: "Suggest new features or improvements",
    color: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    icon: HelpCircle,
    title: "Ask Questions",
    description: "Get help from the community",
    color: "text-sky-500",
    bgColor: "bg-sky-100 dark:bg-sky-900/30",
  },
  {
    icon: Bug,
    title: "Report Bugs",
    description: "Found an issue? Let us know",
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
];

export default function GiscusForm() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-black font-mono">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <BreadcrumbWithCustomSeparator />
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-gradient-to-br from-sky-500/10 via-purple-500/10 to-pink-500/10 dark:from-sky-500/5 dark:via-purple-500/5 dark:to-pink-500/5 p-6 sm:p-8 text-center border border-neutral-200 dark:border-neutral-800 mb-6"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 mb-4">
            <MessageSquare size={24} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-500 to-purple-500 bg-clip-text text-transparent mb-3">
            Public Discussions
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto text-xs md:text-sm">
            Join the conversation! Share feedback, ask questions, or report issues publicly. 
            Let&apos;s build something amazing together.
          </p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="rounded-lg bg-neutral-50 dark:bg-neutral-900 p-4 border border-neutral-200 dark:border-neutral-800 hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-colors group"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${feature.bgColor} ${feature.color} mb-3 group-hover:scale-110 transition-transform`}>
                <feature.icon size={20} />
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Giscus Comments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl bg-white dark:bg-neutral-900 p-4 sm:p-6 shadow-lg border border-neutral-200 dark:border-neutral-800 mb-6"
        >
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <MessageSquare size={16} className="text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                Comments
              </h2>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-500">
                Join the discussion below
              </p>
            </div>
          </div>
          <Giscus />
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 p-5 text-center border border-neutral-200 dark:border-neutral-800"
        >
          <p className="text-neutral-600 dark:text-neutral-400 mb-3 text-xs">
            Prefer a private conversation? Feel free to reach out directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-purple-500 text-white text-sm rounded-lg font-bold shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 hover:scale-105 transition-all"
            >
              <Mail size={16} />
              Go to Contact Form
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-neutral-700 dark:text-neutral-300 hover:text-sky-500 dark:hover:text-sky-400 text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
