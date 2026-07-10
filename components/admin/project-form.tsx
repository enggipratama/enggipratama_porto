"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Upload, X, Plus, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { renderMarkdown } from "@/lib/markdown";

// Tech stack keys map to color schemes
const PRESET_TECHS = [
  { name: "Next.js", key: "nextjs" },
  { name: "React", key: "react" },
  { name: "TypeScript", key: "typescript" },
  { name: "Tailwind", key: "tailwind" },
  { name: "Laravel", key: "laravel" },
  { name: "PHP", key: "php" },
  { name: "MySQL", key: "mysql" },
  { name: "Bootstrap", key: "bootstrap" },
  { name: "Framer Motion", key: "framer" },
];

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string(),
  description: z.string(),
  year: z.string().min(1, "Year is required (e.g. 2025, TBA)"),
  image_url: z.string(),
  demo_url: z.string(),
  github_url: z.string(),
  sort_order: z.number(),
  is_coming_soon: z.boolean(),
  is_visible: z.boolean(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

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
}

interface ProjectFormProps {
  initialData?: Project | null;
  isEdit?: boolean;
}

export function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [techStack, setTechStack] = useState<{ name: string; key: string }[]>([]);
  const [customTechName, setCustomTechName] = useState("");
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      year: new Date().getFullYear().toString(),
      image_url: "",
      demo_url: "",
      github_url: "",
      sort_order: 0,
      is_coming_soon: false,
      is_visible: true,
    },
  });

  const imageUrl = watch("image_url");
  const description = watch("description");
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");

  // Load initial data
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        description: initialData.description || "",
        year: initialData.year || "",
        image_url: initialData.image_url || "",
        demo_url: initialData.demo_url || "",
        github_url: initialData.github_url || "",
        sort_order: initialData.sort_order || 0,
        is_coming_soon: !!initialData.is_coming_soon,
        is_visible: !!initialData.is_visible,
      });
      setTechStack(Array.isArray(initialData.tech_stack) ? initialData.tech_stack : []);
    }
  }, [initialData, reset]);

  // Handle Image Upload
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setValue("image_url", data.url);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  // Add Tech Tag
  function addTechTag(name: string, key: string) {
    const trimmedName = name.trim();
    const trimmedKey = key.trim().toLowerCase();
    if (!trimmedName || !trimmedKey) return;

    if (techStack.some((t) => t.key === trimmedKey)) {
      toast.error("Tech already added");
      return;
    }

    setTechStack((prev) => [...prev, { name: trimmedName, key: trimmedKey }]);
    setCustomTechName("");
  }

  // Remove Tech Tag
  function removeTechTag(key: string) {
    setTechStack((prev) => prev.filter((t) => t.key !== key));
  }

  // Form Submit
  async function onSubmit(values: ProjectFormValues) {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        tech_stack: techStack,
      };

      const url = "/api/admin/projects";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEdit ? { id: initialData?.id, ...payload } : payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save project");
      }

      toast.success(`Project ${isEdit ? "updated" : "created"} successfully`);
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-neutral-800 pb-5">
        <Link href="/admin/projects">
          <Button variant="ghost" size="icon-sm" className="text-neutral-400 hover:text-white">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-mono text-2xl font-bold text-white">
            {isEdit ? "Edit Project" : "New Project"}
          </h1>
          <p className="mt-1 text-sm text-neutral-400 font-mono">
            {isEdit ? "Modify existing project details" : "Add a new showcase to your portfolio"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Row 1: Project Details + Project Image (Equal heights) */}
        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          {/* Main Info */}
          <div className="md:col-span-2 flex">
            <Card className="w-full border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-md rounded-xl transition-all duration-300 hover:border-neutral-750/80 hover:bg-neutral-900/50 flex flex-col justify-between">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-sm font-mono">Project Details</CardTitle>
                <CardDescription className="text-[10px] font-mono">Enter primary name, tags, and description.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5 shrink-0">
                  <Label htmlFor="title" className="text-neutral-300 font-mono text-xs">Project Title</Label>
                  <Input id="title" placeholder="e.g. Davibar Inventory System" {...register("title")} className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 h-10 rounded-lg text-sm" />
                  {errors.title && <p className="text-xs text-red-400 font-mono">{errors.title.message}</p>}
                </div>

                <div className="space-y-1.5 shrink-0">
                  <Label htmlFor="subtitle" className="text-neutral-300 font-mono text-xs">Subtitle / Short Description</Label>
                  <Input
                    id="subtitle"
                    placeholder="e.g. Enterprise Warehouse Management Solution"
                    {...register("subtitle")}
                    className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 h-10 rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between shrink-0">
                    <Label htmlFor="description" className="text-neutral-300 font-mono text-xs">Full Description</Label>
                    <div className="flex rounded-lg bg-neutral-950 p-0.5 border border-neutral-850 font-mono text-[10px]">
                      <button
                        type="button"
                        onClick={() => setEditorTab("write")}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          editorTab === "write"
                            ? "bg-neutral-800 text-white font-semibold"
                            : "text-neutral-505 hover:text-neutral-350"
                        }`}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorTab("preview")}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          editorTab === "preview"
                            ? "bg-neutral-800 text-white font-semibold"
                            : "text-neutral-505 hover:text-neutral-350"
                        }`}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                  {editorTab === "write" ? (
                    <Textarea
                      id="description"
                      placeholder="Describe the project, key features, and your involvement (Markdown supported: **bold**, *italic*, [text](url), lists)..."
                      rows={8}
                      {...register("description")}
                      className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 leading-relaxed font-mono text-xs sm:text-sm flex-1 min-h-[160px]"
                    />
                  ) : (
                    <div className="min-h-[160px] p-4 rounded-md border border-neutral-850 bg-neutral-950/60 overflow-y-auto space-y-2 max-h-[300px] flex-1 font-mono text-xs sm:text-sm">
                      {description ? (
                        renderMarkdown(description)
                      ) : (
                        <p className="text-xs text-neutral-600 font-mono italic">Nothing to preview yet.</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Image */}
          <div className="md:col-span-1 flex">
            <Card className="w-full border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-md rounded-xl transition-all duration-300 hover:border-neutral-750/80 hover:bg-neutral-900/50 flex flex-col justify-between">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-sm font-mono">Project Image</CardTitle>
                <CardDescription className="text-[10px] font-mono">Upload a cover image representing the project.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-955 flex items-center justify-center shadow-inner flex-1 min-h-[180px]">
                  {imageUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl} alt="Thumbnail Preview" className="size-full object-cover animate-none" />
                      <button
                        type="button"
                        onClick={() => setValue("image_url", "")}
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="mx-auto size-8 text-neutral-650 mb-2 animate-none" />
                      <span className="text-xs text-neutral-500 font-mono">No Image Uploaded</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 shrink-0">
                  <Label htmlFor="image-file" className="cursor-pointer block">
                    <div className="flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/60 px-4 py-2 text-sm text-neutral-350 transition-colors hover:bg-neutral-850 hover:text-white text-center font-mono h-10 shadow-sm">
                      <Upload className="size-4" />
                      {uploading ? "Uploading..." : "Upload Cover Image"}
                    </div>
                  </Label>
                  <input
                    id="image-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <Input
                    placeholder="Or paste external image URL..."
                    value={imageUrl}
                    onChange={(e) => setValue("image_url", e.target.value)}
                    className="mt-2 text-xs font-mono bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 h-10 rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Row 2: Links & Organization + Tech Stack (Equal heights) */}
        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          {/* Links & Visibility Settings */}
          <div className="md:col-span-2 flex">
            <Card className="w-full border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-md rounded-xl transition-all duration-300 hover:border-neutral-750/80 hover:bg-neutral-900/50 flex flex-col justify-between">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-sm font-mono">Links, Visibility & Settings</CardTitle>
                <CardDescription className="text-[10px] font-mono">Configure external resources, ordering indices, and publishing parameters.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="year" className="text-neutral-300 font-mono text-xs">Development Year</Label>
                      <Input id="year" placeholder="e.g. 2025, TBA" {...register("year")} className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 h-10 rounded-lg text-sm" />
                      {errors.year && <p className="text-xs text-red-400 font-mono">{errors.year.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="sort_order" className="text-neutral-300 font-mono text-xs">Display Order (Sort Index)</Label>
                      <Input
                        id="sort_order"
                        type="number"
                        placeholder="e.g. 1, 2"
                        {...register("sort_order", { valueAsNumber: true })}
                        className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 h-10 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="demo_url" className="text-neutral-300 font-mono text-xs">Live Demo URL</Label>
                      <Input id="demo_url" type="url" placeholder="https://..." {...register("demo_url")} className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 h-10 rounded-lg text-sm" />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="github_url" className="text-neutral-300 font-mono text-xs">GitHub Repository URL</Label>
                      <Input id="github_url" type="url" placeholder="https://github.com/..." {...register("github_url")} className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 h-10 rounded-lg text-sm" />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-neutral-900/60 my-2 shrink-0" />

                <div className="grid gap-4 sm:grid-cols-2 shrink-0">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/40 border border-neutral-850 shadow-inner">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_visible" className="text-neutral-300 font-mono text-xs">Visible on Site</Label>
                      <p className="text-[10px] text-neutral-500 font-mono">Publish to live timeline</p>
                    </div>
                    <Switch
                      id="is_visible"
                      checked={watch("is_visible")}
                      onCheckedChange={(checked) => setValue("is_visible", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-955/40 border border-neutral-850 shadow-inner">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_coming_soon" className="text-neutral-300 font-mono text-xs">Coming Soon</Label>
                      <p className="text-[10px] text-neutral-500 font-mono">Mark project as WIP</p>
                    </div>
                    <Switch
                      id="is_coming_soon"
                      checked={watch("is_coming_soon")}
                      onCheckedChange={(checked) => setValue("is_coming_soon", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tech Stack */}
          <div className="md:col-span-1 flex">
            <Card className="w-full border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-md rounded-xl transition-all duration-300 hover:border-neutral-750/80 hover:bg-neutral-900/50 flex flex-col justify-between">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-sm font-mono">Tech Stack</CardTitle>
                <CardDescription className="text-[10px] font-mono">Select or add tools used in building.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                {/* List tags */}
                <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2.5 rounded-xl bg-neutral-955/40 border border-neutral-850 flex-1">
                  {techStack.map((tech) => (
                    <Badge key={tech.key} variant="neutral" className="gap-1 text-[10px] font-mono px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-lg">
                      {tech.name}
                      <button type="button" onClick={() => removeTechTag(tech.key)} className="hover:text-red-400 transition-colors">
                        <X className="size-3 text-neutral-500" />
                      </button>
                    </Badge>
                  ))}
                  {techStack.length === 0 && (
                    <span className="text-[10px] text-neutral-600 font-mono italic py-1 self-center w-full text-center">No technologies added yet.</span>
                  )}
                </div>

                {/* Preset tags */}
                <div className="space-y-2 shrink-0">
                  <p className="text-[10px] text-neutral-550 uppercase tracking-wider font-mono">Quick Add Presets:</p>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_TECHS.map((preset) => {
                      const isAdded = techStack.some((t) => t.key === preset.key);
                      return (
                        <button
                          key={preset.key}
                          type="button"
                          disabled={isAdded}
                          onClick={() => addTechTag(preset.name, preset.key)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                            isAdded
                              ? "border-neutral-850 bg-neutral-900/40 text-neutral-650 cursor-not-allowed"
                              : "border-neutral-750 bg-neutral-800/60 text-neutral-300 hover:bg-neutral-700 hover:text-white cursor-pointer"
                          }`}
                        >
                          {preset.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Add Custom Tech Tag - Responsive Layout Stack */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1 shrink-0">
                  <Input
                    placeholder="Custom tech tag (e.g. Supabase)"
                    value={customTechName}
                    onChange={(e) => setCustomTechName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTechTag(customTechName, customTechName);
                      }
                    }}
                    className="text-xs bg-neutral-955 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 h-10 w-full rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTechTag(customTechName, customTechName)}
                    className="w-full sm:w-auto shrink-0 h-10 px-4 rounded-lg border-neutral-800"
                  >
                    <Plus className="size-4 mr-1.5" />
                    Add Tag
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons - Only at the bottom */}
        <div className="flex justify-end gap-3 border-t border-neutral-900/60 pt-6">
          <Link href="/admin/projects">
            <Button type="button" variant="outline" className="border-neutral-850 hover:bg-neutral-900 hover:text-white rounded-lg h-10 px-4 font-mono text-xs">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={submitting} className="min-w-[120px] bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-400 hover:to-purple-400 text-white font-mono rounded-lg transition-all duration-300 shadow-md shadow-sky-500/10 border-0 h-10 text-xs font-bold">
            {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isEdit ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>
    </div>
  );
}
