"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Star, GitFork, Code2, Activity, ExternalLink, FolderGit2 } from "lucide-react";
import GithubHeatmap from "@/components/github-heatmap";
import { SkeletonCard, SkeletonStatCard, SkeletonHeatmap } from "@/components/skeleton-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";

interface GitHubRepo {
  id: string;
  name: string;
  description: string | null;
  url: string;
  html_url?: string;
  stargazerCount?: number;
  stargazers_count?: number;
  forkCount?: number;
  forks_count?: number;
  language?: string;
  primaryLanguage?: {
    name: string;
    color: string;
  } | null;
}

interface GitHubData {
  repositories: {
    totalCount: number;
  };
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number;
    };
  };
  pinnedItems: {
    nodes: GitHubRepo[];
  };
}

const langColors: Record<string, string> = {
  Laravel: "bg-red-500",
  PHP: "bg-indigo-500",
  "C++": "bg-pink-600",
  Python: "bg-yellow-500",
  "Next.js": "bg-neutral-900 dark:bg-white",
  React: "bg-sky-400",
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  "Tailwind CSS": "bg-cyan-400",
  CSS: "bg-blue-400",
  HTML: "bg-orange-500",
  Unknown: "bg-gray-400",
};

const username = "enggipratama";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "tween" as const,
      ease: [0.16, 1, 0.3, 1] as const, // iOS custom ease-out
      duration: 1.0
    }
  }
};

function StatCard({ value, label, icon: Icon, iconColor }: { value: string | number; label: string; icon: React.ElementType; iconColor: string }) {
  return (
    <motion.div 
      variants={itemVariants}
      className="flex h-full flex-col items-center justify-center gap-1 rounded-xl border border-neutral-300/50 bg-neutral-50/80 p-2 text-center shadow-md shadow-neutral-200/40 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.04] dark:shadow-2xl dark:shadow-black/50 sm:p-4"
    >
      <div className={`flex h-7 w-7 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${iconColor}`}>
        <Icon className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
      </div>
      <p className="mt-0.5 font-mono text-base font-bold text-neutral-900 dark:text-white sm:mt-1 sm:text-lg">{value}</p>
      <p className="font-mono text-[10px] leading-tight text-neutral-500 dark:text-neutral-300 sm:text-xs">{label}</p>
    </motion.div>
  );
}

function RepoCard({ repo }: { repo: GitHubRepo }) {
  const language = repo.language || repo.primaryLanguage?.name || "Unknown";
  const langColor = langColors[language] || "bg-gray-400";
  const stars = repo.stargazerCount || repo.stargazers_count || 0;
  const forks = repo.forkCount || repo.forks_count || 0;
  const url = repo.url || repo.html_url || "#";

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      variants={itemVariants}
      whileHover={{ y: -4 }}
      className="group flex flex-col rounded-xl border border-neutral-300/50 bg-neutral-50/80 p-4 shadow-md shadow-neutral-200/40 backdrop-blur-md transition-all hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:shadow-2xl dark:shadow-black/50 dark:hover:border-sky-500/30 dark:hover:shadow-sky-500/10 sm:p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <FolderGit2 className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
          <h3 className="truncate font-mono text-sm font-semibold text-sky-600 hover:underline dark:text-sky-400 sm:text-base">
            {repo.name}
          </h3>
        </div>
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-neutral-600" />
      </div>

      <p className="mt-2 line-clamp-2 font-mono text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm">
        {repo.description || "No description available."}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
        <Badge variant="default" icon={<span className={`h-2 w-2 shrink-0 rounded-full ${langColor}`} />}>
          {language}
        </Badge>

        {stars > 0 && (
          <Badge variant="yellow" icon={<Star className="h-3 w-3 shrink-0" />}>
            {stars}
          </Badge>
        )}

        {forks > 0 && (
          <Badge variant="sky" icon={<GitFork className="h-3 w-3 shrink-0" />}>
            {forks}
          </Badge>
        )}
      </div>
    </motion.a>
  );
}

export default function GithubSection() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/github");
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError("Unable to load GitHub data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="relative w-full overflow-hidden bg-white py-16 dark:bg-black sm:py-20" id="github">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-8 text-center sm:mb-10">
            <div className="mb-2 inline-flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <div className="mx-auto mt-2 h-8 w-48 rounded bg-neutral-200 dark:bg-neutral-800 sm:h-10 sm:w-64" />
            <div className="mx-auto mt-2 h-4 w-64 rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>

          {/* Main Content Skeleton */}
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

          {/* Pinned Repositories Skeleton */}
          <div className="mt-8 sm:mt-10">
            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <div className="h-5 w-40 rounded bg-neutral-200 dark:bg-neutral-800 sm:h-6 sm:w-48" />
              <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="relative w-full overflow-hidden bg-white py-16 dark:bg-black sm:py-20" id="github">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <Github className="mx-auto h-12 w-12 text-neutral-400" />
          <h3 className="mt-4 font-mono text-lg font-semibold text-neutral-900 dark:text-white">
            Unable to load GitHub data
          </h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Please check your connection and try again
          </p>
          <button
            onClick={fetchData}
            className="mt-4 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-600"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  const repos = data.pinnedItems.nodes;
  const totalContributions = data.contributionsCollection.contributionCalendar.totalContributions;
  const totalRepos = data.repositories.totalCount;
  const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazerCount || repo.stargazers_count || 0), 0);
  const totalForks = repos.reduce((acc, repo) => acc + (repo.forkCount || repo.forks_count || 0), 0);

  return (
    <section className="relative w-full overflow-hidden bg-white py-12 dark:bg-black sm:py-16 lg:py-20" id="github">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-10">
          <div className="mb-2 inline-flex items-center gap-2">
            <Github className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
            <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">@{username}</span>
          </div>
          <SectionHeader
            title="Code Contributions"
            subtitle="My open-source journey and development metrics"
          />
        </div>

        {/* Main Content - Mobile: Stack, Desktop: Grid */}
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Heatmap */}
          <div className="w-full lg:col-span-2">
            <GithubHeatmap username={username} />
          </div>

          {/* Stats - 2x2 Grid with staggered reveal */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-2 lg:grid-rows-2 lg:gap-4"
          >
            <StatCard value={totalRepos} label="Repositories" icon={Code2} iconColor="bg-blue-500" />
            <StatCard value={totalContributions.toLocaleString()} label="Contributions" icon={Activity} iconColor="bg-emerald-500" />
            <StatCard value={totalStars} label="Stars Earned" icon={Star} iconColor="bg-yellow-500" />
            <StatCard value={totalForks} label="Forks" icon={GitFork} iconColor="bg-sky-500" />
          </motion.div>
        </div>

        {/* Pinned Repositories */}
        <div className="mt-8 sm:mt-10">
          <div className="mb-4 flex items-center justify-between sm:mb-5">
            <h3 className="font-mono text-sm font-semibold text-neutral-900 dark:text-white sm:text-base">
              Highlighted Projects
            </h3>
            <a
              href={`https://github.com/${username}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-sky-600 hover:underline dark:text-sky-400"
            >
              View All Repos
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4"
          >
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
