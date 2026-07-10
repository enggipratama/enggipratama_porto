"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const githubSchema = z.object({
  github_username: z.string().min(1, "GitHub username is required"),
  github_section_title: z.string().min(1, "Section title is required"),
  github_section_subtitle: z.string().min(1, "Section subtitle is required"),
  github_stat_repos: z.string().min(1, "Repositories label is required"),
  github_stat_contributions: z.string().min(1, "Contributions label is required"),
  github_stat_stars: z.string().min(1, "Stars label is required"),
  github_stat_forks: z.string().min(1, "Forks label is required"),
  github_pinned_title: z.string().min(1, "Highlighted projects title is required"),
  github_view_all: z.string().min(1, "View all label is required"),
});

type GithubFormValues = z.infer<typeof githubSchema>;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function GithubEditorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GithubFormValues>({
    resolver: zodResolver(githubSchema),
    defaultValues: {
      github_username: "",
      github_section_title: "",
      github_section_subtitle: "",
      github_stat_repos: "",
      github_stat_contributions: "",
      github_stat_stars: "",
      github_stat_forks: "",
      github_pinned_title: "",
      github_view_all: "",
    },
  });

  // Fetch current data
  useEffect(() => {
    async function fetchData() {
      try {
        const keys = [
          "github_username",
          "github_section_title",
          "github_section_subtitle",
          "github_stat_repos",
          "github_stat_contributions",
          "github_stat_stars",
          "github_stat_forks",
          "github_pinned_title",
          "github_view_all",
        ];
        const params = keys.map((k) => `key=${k}`).join("&");
        const res = await fetch(`/api/admin/settings?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        reset({
          github_username: data.github_username ?? "",
          github_section_title: data.github_section_title ?? "",
          github_section_subtitle: data.github_section_subtitle ?? "",
          github_stat_repos: data.github_stat_repos ?? "",
          github_stat_contributions: data.github_stat_contributions ?? "",
          github_stat_stars: data.github_stat_stars ?? "",
          github_stat_forks: data.github_stat_forks ?? "",
          github_pinned_title: data.github_pinned_title ?? "",
          github_view_all: data.github_view_all ?? "",
        });
      } catch {
        toast.error("Failed to load GitHub settings");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [reset]);

  // Save
  async function onSave(values: GithubFormValues) {
    setSaving(true);
    try {
      const entries = Object.entries(values).map(([key, value]) => ({ key, value }));
      for (const entry of entries) {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
        if (!res.ok) throw new Error(`Failed to save ${entry.key}`);
      }
      toast.success("GitHub section settings saved successfully");
      router.refresh();
    } catch {
      toast.error("Failed to save GitHub settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-800" />
        <div className="h-80 animate-pulse rounded-xl bg-neutral-800/50" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="border-b border-neutral-800 pb-5">
        <h1 className="font-mono text-2xl font-bold text-white">GitHub Section</h1>
        <p className="mt-1 font-mono text-sm text-neutral-400">
          Manage the labels and texts shown in the GitHub stats area below your projects.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="max-w-4xl mx-auto space-y-8">
        <Card className="border-neutral-800 bg-neutral-900/50 shadow-lg transition-all hover:border-neutral-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-white">General</CardTitle>
            <CardDescription>
              The GitHub username controls the &ldquo;@{`{username}`}&rdquo; display and the View All link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="github_username" className="font-mono text-xs text-neutral-300">GitHub Username</Label>
              <Input
                id="github_username"
                placeholder="e.g. enggipratama"
                {...register("github_username")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
              />
              {errors.github_username && (
                <p className="text-xs text-red-400">{errors.github_username.message}</p>
              )}
              <p className="font-mono text-[11px] text-neutral-500">
                The actual data source is still read from the GITHUB_USERNAME environment variable.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/50 shadow-lg transition-all hover:border-neutral-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-white">Section Header</CardTitle>
            <CardDescription>The title and subtitle of the GitHub stats section.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="github_section_title" className="font-mono text-xs text-neutral-300">Section Title</Label>
              <Input
                id="github_section_title"
                placeholder="e.g. Code Contributions"
                {...register("github_section_title")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
              />
              {errors.github_section_title && (
                <p className="text-xs text-red-400">{errors.github_section_title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="github_section_subtitle" className="font-mono text-xs text-neutral-300">Section Subtitle</Label>
              <Input
                id="github_section_subtitle"
                placeholder="e.g. My open-source journey and development metrics"
                {...register("github_section_subtitle")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
              />
              {errors.github_section_subtitle && (
                <p className="text-xs text-red-400">{errors.github_section_subtitle.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/50 shadow-lg transition-all hover:border-neutral-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-white">Stat Card Labels</CardTitle>
            <CardDescription>The four metric cards in the GitHub stats grid.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="github_stat_repos" className="font-mono text-xs text-neutral-300">Repositories Label</Label>
              <Input
                id="github_stat_repos"
                placeholder="e.g. Repositories"
                {...register("github_stat_repos")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
              />
              {errors.github_stat_repos && (
                <p className="text-xs text-red-400">{errors.github_stat_repos.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="github_stat_contributions" className="font-mono text-xs text-neutral-300">Contributions Label</Label>
              <Input
                id="github_stat_contributions"
                placeholder="e.g. Contributions"
                {...register("github_stat_contributions")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
              />
              {errors.github_stat_contributions && (
                <p className="text-xs text-red-400">{errors.github_stat_contributions.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="github_stat_stars" className="font-mono text-xs text-neutral-300">Stars Label</Label>
              <Input
                id="github_stat_stars"
                placeholder="e.g. Stars Earned"
                {...register("github_stat_stars")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
              />
              {errors.github_stat_stars && (
                <p className="text-xs text-red-400">{errors.github_stat_stars.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="github_stat_forks" className="font-mono text-xs text-neutral-300">Forks Label</Label>
              <Input
                id="github_stat_forks"
                placeholder="e.g. Forks"
                {...register("github_stat_forks")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
              />
              {errors.github_stat_forks && (
                <p className="text-xs text-red-400">{errors.github_stat_forks.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/50 shadow-lg transition-all hover:border-neutral-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-white">Pinned Repositories</CardTitle>
            <CardDescription>The heading and link for the highlighted projects list.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="github_pinned_title" className="font-mono text-xs text-neutral-300">Heading Title</Label>
              <Input
                id="github_pinned_title"
                placeholder="e.g. Highlighted Projects"
                {...register("github_pinned_title")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
              />
              {errors.github_pinned_title && (
                <p className="text-xs text-red-400">{errors.github_pinned_title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="github_view_all" className="font-mono text-xs text-neutral-300">View All Link</Label>
              <Input
                id="github_view_all"
                placeholder="e.g. View All Repos"
                {...register("github_view_all")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
              />
              {errors.github_view_all && (
                <p className="text-xs text-red-400">{errors.github_view_all.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Footer */}
        <div className="flex justify-end border-t border-neutral-900/60 pt-6">
          <Button
            type="submit"
            disabled={saving}
            className="min-w-[120px] w-full sm:w-auto bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-400 hover:to-purple-400 text-white font-mono rounded-lg transition-all duration-300 shadow-md shadow-sky-500/10 border-0 h-10 text-xs font-bold"
          >
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
