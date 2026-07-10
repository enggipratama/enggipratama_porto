"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  year: string;
  image_url: string;
  demo_url: string;
  github_url: string;
  tech_stack: { name: string; key: string }[];
  sort_order: number;
  is_coming_soon: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

type BadgeColor =
  | "default"
  | "success"
  | "sky"
  | "purple"
  | "emerald"
  | "neutral"
  | "yellow"
  | "red"
  | "blue"
  | "cyan"
  | "indigo"
  | "pink";

const badgeColors: BadgeColor[] = [
  "sky",
  "purple",
  "emerald",
  "yellow",
  "red",
  "blue",
  "cyan",
  "indigo",
  "pink",
  "success",
];

function getYearColorVariant(year: string): BadgeColor {
  const clean = year.trim();
  if (clean === "TBA" || clean === "Coming Soon") return "neutral";
  const yearNum = parseInt(clean);
  if (isNaN(yearNum)) {
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = clean.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % badgeColors.length;
    return badgeColors[index];
  }
  const index = yearNum % badgeColors.length;
  return badgeColors[index];
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/admin/projects");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : data.projects ?? []);
      } catch {
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Toggle visibility
  async function toggleVisibility(project: Project) {
    setTogglingId(project.id);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: project.id, is_visible: !project.is_visible }),
      });
      if (!res.ok) throw new Error("Failed to update");

      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, is_visible: !p.is_visible } : p
        )
      );
      toast.success(
        `Project ${!project.is_visible ? "visible" : "hidden"} successfully`
      );
    } catch {
      toast.error("Failed to toggle visibility");
    } finally {
      setTogglingId(null);
    }
  }

  // Delete project
  async function deleteProject(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted successfully");
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-800" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-neutral-800/50" />
          ))}
        </div>
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
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-800 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white flex items-center gap-2">
            Projects
          </h1>
          <p className="mt-1 text-sm text-neutral-400 font-mono">
            Manage your portfolio projects and visibilities.
          </p>
        </div>
        <Link href="/admin/projects/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto h-9 font-mono bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-400 hover:to-purple-400 text-white border-0 transition-all duration-300 shadow-md shadow-sky-500/10 rounded-lg">
            <Plus className="mr-1.5 size-4" />
            Add New Project
          </Button>
        </Link>
      </div>

      {/* Project List */}
      {projects.length === 0 ? (
        <Card className="border-neutral-800 bg-neutral-900/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-neutral-500 font-mono">No projects yet.</p>
            <Link href="/admin/projects/new" className="mt-4">
              <Button variant="outline">
                <Plus className="mr-2 size-4" />
                Create Your First Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="h-full"
            >
              <Card className="border-neutral-800 bg-neutral-900/40 backdrop-blur-md hover:border-neutral-750/80 hover:bg-neutral-900/50 transition-all duration-300 shadow-md rounded-xl hover:-translate-y-[1.5px] group h-full">
                <CardContent className="p-4 flex flex-col h-full gap-3">
                  {/* Top: Thumbnail + Info */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Thumbnail */}
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 shadow-inner">
                      {project.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-[9px] text-neutral-600 font-mono">
                          No img
                        </div>
                      )}
                      {!project.is_visible && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-[1px]">
                          <EyeOff className="size-3.5 text-neutral-500" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-medium text-white text-sm font-mono">
                        {project.title}
                      </h3>
                      <p className="mt-0.5 truncate text-[11px] text-neutral-450 font-mono">
                        {project.subtitle}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <Badge variant={getYearColorVariant(project.year)} size="sm" className="font-mono text-[8px] px-1 shrink-0">
                          {project.year}
                        </Badge>
                        {project.is_coming_soon && (
                          <Badge variant="purple" size="sm" className="font-mono text-[8px] bg-purple-950/20 border border-purple-900/30 text-purple-400 shrink-0">
                            Soon
                          </Badge>
                        )}
                        {project.tech_stack.slice(0, 2).map((tech) => (
                          <Badge key={tech.key} variant="neutral" size="sm" className="font-mono text-[8px] bg-neutral-950/40 border border-neutral-850 text-neutral-450 shrink-0">
                            {tech.name}
                          </Badge>
                        ))}
                        {project.tech_stack.length > 2 && (
                          <Badge variant="neutral" size="sm" className="font-mono text-[8px] bg-neutral-950/40 border border-neutral-850 text-neutral-450 shrink-0">
                            +{project.tech_stack.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Actions */}
                  <div className="flex items-center justify-between border-t border-neutral-800/60 pt-3 mt-auto">
                    {/* Visibility Toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500 font-mono flex items-center gap-1.5">
                        {project.is_visible ? (
                          <>
                            <Eye className="size-3.5 text-emerald-400" />
                            <span className="text-emerald-500/80 text-[10px] font-mono">Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="size-3.5 text-neutral-500" />
                            <span className="text-neutral-550 text-[10px] font-mono">Hidden</span>
                          </>
                        )}
                      </span>
                      <Switch
                        checked={project.is_visible}
                        onCheckedChange={() => toggleVisibility(project)}
                        disabled={togglingId === project.id}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      {/* Demo link */}
                      {project.demo_url ? (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Demo"
                        >
                          <Button className="h-7 w-7 border border-neutral-855 bg-neutral-950/60 text-neutral-400 hover:text-sky-400 hover:border-sky-500/30 hover:bg-sky-500/10 transition-all duration-200 rounded-lg p-0 flex items-center justify-center">
                            <ExternalLink className="size-3.5" />
                          </Button>
                        </a>
                      ) : (
                        <Button disabled title="No demo available" className="h-7 w-7 border border-neutral-900/50 bg-neutral-950/20 text-neutral-600 rounded-lg p-0 flex items-center justify-center opacity-30 cursor-not-allowed">
                          <ExternalLink className="size-3.5" />
                        </Button>
                      )}

                      {/* Edit */}
                      <Link href={`/admin/projects/${project.id}`} title="Edit Project">
                        <Button className="h-7 w-7 border border-neutral-855 bg-neutral-950/60 text-neutral-400 hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/10 transition-all duration-200 rounded-lg p-0 flex items-center justify-center">
                          <Pencil className="size-3.5" />
                        </Button>
                      </Link>

                      {/* Delete */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            title="Delete Project"
                            className="h-7 w-7 border border-neutral-855 bg-neutral-950/60 text-red-400 hover:text-red-300 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-200 rounded-lg p-0 flex items-center justify-center"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="border-neutral-800 bg-neutral-950 text-white">
                          <DialogHeader>
                            <DialogTitle className="text-white">Delete Project</DialogTitle>
                            <DialogDescription className="text-neutral-400">
                              Are you sure you want to delete &ldquo;{project.title}&rdquo;?
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" className="border-neutral-800 hover:bg-neutral-900 hover:text-white rounded-lg font-mono">
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => deleteProject(project.id)}
                              disabled={deletingId === project.id}
                              className="bg-red-650 hover:bg-red-700 rounded-lg font-mono"
                            >
                              {deletingId === project.id && (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                              )}
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
