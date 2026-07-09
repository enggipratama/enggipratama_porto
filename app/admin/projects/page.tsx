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
import { Separator } from "@/components/ui/separator";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white">Projects</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage your portfolio projects.
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="mr-2 size-4" />
            Add New Project
          </Button>
        </Link>
      </div>

      {/* Project List */}
      {projects.length === 0 ? (
        <Card className="border-neutral-800 bg-neutral-900/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-neutral-500">No projects yet.</p>
            <Link href="/admin/projects/new" className="mt-4">
              <Button variant="outline">
                <Plus className="mr-2 size-4" />
                Create Your First Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="border-neutral-800 bg-neutral-900/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800">
                      {project.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-xs text-neutral-600">
                          No img
                        </div>
                      )}
                      {!project.is_visible && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                          <EyeOff className="size-4 text-neutral-400" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-medium text-white">
                          {project.title}
                        </h3>
                        <Badge variant="neutral" size="sm">
                          {project.year}
                        </Badge>
                        {project.is_coming_soon && (
                          <Badge variant="yellow" size="sm">
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-sm text-neutral-400">
                        {project.subtitle}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {project.tech_stack.slice(0, 4).map((tech) => (
                          <Badge key={tech.key} variant="default" size="sm">
                            {tech.name}
                          </Badge>
                        ))}
                        {project.tech_stack.length > 4 && (
                          <Badge variant="default" size="sm">
                            +{project.tech_stack.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2">
                      {/* Visibility Toggle */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">
                          {project.is_visible ? (
                            <Eye className="size-4 text-emerald-400" />
                          ) : (
                            <EyeOff className="size-4 text-neutral-500" />
                          )}
                        </span>
                        <Switch
                          checked={project.is_visible}
                          onCheckedChange={() => toggleVisibility(project)}
                          disabled={togglingId === project.id}
                        />
                      </div>

                      <Separator orientation="vertical" className="h-8 bg-neutral-700" />

                      {/* Demo link */}
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="icon-sm">
                            <ExternalLink className="size-4" />
                          </Button>
                        </a>
                      )}

                      {/* Edit */}
                      <Link href={`/admin/projects/${project.id}`}>
                        <Button variant="ghost" size="icon-sm">
                          <Pencil className="size-4" />
                        </Button>
                      </Link>

                      {/* Delete */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Project</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete &ldquo;{project.title}&rdquo;?
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" className="mr-2">
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => deleteProject(project.id)}
                              disabled={deletingId === project.id}
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
