"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import * as Lucide from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge, BadgeVariant } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const aboutSchema = z.object({
  about_fullname: z.string().min(1, "Full name is required"),
  about_nickname: z.string().min(1, "Nickname is required"),
  about_title: z.string().min(1, "Title is required"),
  about_badge_title: z.string().min(1, "Profile badge title is required"),
  about_badge_text: z.string().min(1, "Badge text is required"),
  seo_title: z.string().min(1, "SEO Title is required"),
  seo_description: z.string().min(1, "SEO Description is required"),
  seo_keywords: z.string().min(1, "SEO Keywords is required"),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

const PRESET_SKILLS: { name: string; variant: BadgeVariant }[] = [
  { name: "Next.js", variant: "neutral" },
  { name: "React", variant: "sky" },
  { name: "TypeScript", variant: "blue" },
  { name: "Tailwind", variant: "cyan" },
  { name: "Laravel", variant: "red" },
  { name: "PHP", variant: "indigo" },
  { name: "MySQL", variant: "blue" },
  { name: "Framer", variant: "pink" },
  { name: "Git", variant: "purple" },
  { name: "Node.js", variant: "success" },
  { name: "Vue", variant: "emerald" },
  { name: "Python", variant: "yellow" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AboutEditorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paragraphs, setParagraphs] = useState<string[]>([""]);
  const [profileImage, setProfileImage] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [socialLinks, setSocialLinks] = useState<{ label: string; href: string; platform: string; icon?: string; color?: string }[]>([]);
  const [skills, setSkills] = useState<{ name: string; variant: BadgeVariant }[]>([]);
  const [customSkillName, setCustomSkillName] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: { 
      about_fullname: "", 
      about_nickname: "",
      about_title: "", 
      about_badge_title: "",
      about_badge_text: "",
      seo_title: "",
      seo_description: "",
      seo_keywords: ""
    },
  });

  // Fetch current data
  useEffect(() => {
    async function fetchData() {
      try {
        const keys = [
          "about_fullname",
          "about_nickname",
          "about_title",
          "about_badge_title",
          "about_description",
          "about_badge_text",
          "about_profile_image",
          "about_cv_url",
          "social_links",
          "skills",
          "seo_title",
          "seo_description",
          "seo_keywords",
        ];
        const params = keys.map((k) => `key=${k}`).join("&");
        const res = await fetch(`/api/admin/settings?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        reset({
          about_fullname: data.about_fullname ?? "",
          about_nickname: data.about_nickname ?? "",
          about_title: data.about_title ?? "",
          about_badge_title: data.about_badge_title ?? "",
          about_badge_text: data.about_badge_text ?? "",
          seo_title: data.seo_title ?? "",
          seo_description: data.seo_description ?? "",
          seo_keywords: data.seo_keywords ?? "",
        });

        if (Array.isArray(data.about_description) && data.about_description.length > 0) {
          setParagraphs(data.about_description);
        }
        if (data.about_profile_image) {
          setProfileImage(data.about_profile_image);
        }
        if (data.about_cv_url) {
          setCvUrl(data.about_cv_url);
        }
        if (Array.isArray(data.social_links)) {
          setSocialLinks(data.social_links);
        }
        if (Array.isArray(data.skills)) {
          setSkills(data.skills);
        }
      } catch {
        toast.error("Failed to load about settings");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [reset]);

  // Paragraph management
  function updateParagraph(index: number, value: string) {
    setParagraphs((prev) => prev.map((p, i) => (i === index ? value : p)));
  }

  // Add paragraph
  function addParagraph() {
    setParagraphs((prev) => [...prev, ""]);
  }

  // Remove paragraph
  function removeParagraph(index: number) {
    if (paragraphs.length <= 1) {
      toast.error("At least one paragraph is required");
      return;
    }
    setParagraphs((prev) => prev.filter((_, i) => i !== index));
  }

  // Image upload
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (profileImage) {
        formData.append("oldUrl", profileImage);
      }

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setProfileImage(data.url);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  // CV Upload
  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCv(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (cvUrl) {
        formData.append("oldUrl", cvUrl);
      }

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Upload failed");
      }
      const data = await res.json();
      setCvUrl(data.url);
      toast.success("CV uploaded successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload CV");
    } finally {
      setUploadingCv(false);
    }
  }

  // Social links management
  function updateSocialLink(index: number, field: "label" | "href" | "platform" | "icon" | "color", value: string) {
    setSocialLinks((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };
          if (field === "platform" && value === "custom") {
            // Seed custom fields if converting to custom
            return {
              ...updated,
              icon: item.icon || "Globe",
              color: item.color || "#0ea5e9",
            };
          }
          return updated;
        }
        return item;
      })
    );
  }

  // Add social link
  function addSocialLink() {
    setSocialLinks((prev) => [...prev, { label: "GitHub", href: "https://github.com/", platform: "github" }]);
  }

  // Remove social link
  function removeSocialLink(index: number) {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  }

  // Skills management
  function addSkillTag(name: string, variant: BadgeVariant) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Skill already added");
      return;
    }
    setSkills((prev) => [...prev, { name: trimmed, variant }]);
  }

  function handleAddCustomSkill() {
    const trimmed = customSkillName.trim();
    if (!trimmed) return;
    const colorVariants: BadgeVariant[] = ["sky", "purple", "emerald", "blue", "cyan", "indigo", "pink", "yellow", "red", "success"];
    const variant = colorVariants[skills.length % colorVariants.length];
    addSkillTag(trimmed, variant);
    setCustomSkillName("");
  }

  function removeSkill(index: number) {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  }

  // Save
  async function onSave(values: AboutFormValues) {
    setSaving(true);
    try {
      const filteredParagraphs = paragraphs.filter((p) => p.trim());
      if (filteredParagraphs.length === 0) {
        toast.error("At least one non-empty paragraph is required");
        setSaving(false);
        return;
      }

      const entries = [
        { key: "about_fullname", value: values.about_fullname },
        { key: "about_nickname", value: values.about_nickname },
        { key: "about_title", value: values.about_title },
        { key: "about_badge_title", value: values.about_badge_title },
        { key: "about_badge_text", value: values.about_badge_text },
        { key: "seo_title", value: values.seo_title },
        { key: "seo_description", value: values.seo_description },
        { key: "seo_keywords", value: values.seo_keywords },
        { key: "about_description", value: filteredParagraphs },
        { key: "about_profile_image", value: profileImage },
        { key: "about_cv_url", value: cvUrl },
        { key: "social_links", value: socialLinks },
        { key: "skills", value: skills },
      ];

      for (const entry of entries) {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
        if (!res.ok) throw new Error(`Failed to save ${entry.key}`);
      }
      toast.success("About section saved successfully");
      router.refresh();
    } catch {
      toast.error("Failed to save about settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-800" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-neutral-800/50" />
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
      <div className="border-b border-neutral-800 pb-5">
        <h1 className="font-mono text-2xl font-bold text-white">About Section</h1>
        <p className="mt-1 font-mono text-sm text-neutral-400">
          Manage the about section content of your portfolio.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="max-w-4xl mx-auto space-y-8">
        
        {/* Row 1: Profile Image & CV File (Side-by-side on desktop, stacked on mobile) */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          
          {/* Profile Image Card */}
          <Card className="border-neutral-800 bg-neutral-900/50 shadow-lg h-full transition-all hover:border-neutral-800/80">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-sm font-mono">Profile Image</CardTitle>
              <CardDescription className="text-[10px] font-mono">Your profile photo displayed in the about section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative size-32 overflow-hidden rounded-xl border border-neutral-700 bg-neutral-800 shadow-inner shrink-0">
                  {profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Lucide.Image className="size-10 text-neutral-600" />
                    </div>
                  )}
                </div>
                <div className="flex-grow space-y-2 text-center sm:text-left">
                  <Label htmlFor="profile-upload" className="cursor-pointer inline-block">
                    <div className="inline-flex items-center gap-2 rounded-md border border-neutral-750 bg-neutral-800 px-4 py-2 text-sm text-neutral-350 transition-colors hover:bg-neutral-700 hover:text-white font-mono">
                      <Lucide.Upload className="size-4" />
                      {uploading ? "Uploading..." : "Upload Photo"}
                    </div>
                  </Label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <p className="font-mono text-[11px] text-neutral-500">
                    Recommended: Square image, at least 400×400px
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CV / Resume File Card */}
          <Card className="border-neutral-800 bg-neutral-900/50 shadow-lg h-full transition-all hover:border-neutral-800/80">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-sm font-mono">CV / Resume File</CardTitle>
              <CardDescription className="text-[10px] font-mono">Provide your downloadable curriculum vitae.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col justify-between h-[calc(100%-80px)]">
              <div className="space-y-3 flex-grow">
                <div className="space-y-1.5">
                  <Label htmlFor="cv_url_input" className="font-mono text-xs text-neutral-300">CV File Link</Label>
                  <Input
                    id="cv_url_input"
                    value={cvUrl}
                    onChange={(e) => setCvUrl(e.target.value)}
                    placeholder="/Resume.pdf or https://..."
                    className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
                  />
                </div>

                {cvUrl && (
                  <div className="flex items-center gap-2 rounded-md border border-emerald-950/30 bg-emerald-950/10 px-3 py-2 text-[11px] text-emerald-400 font-mono shadow-sm">
                    <Lucide.FileCheck className="size-4 shrink-0" />
                    <span className="truncate">Active: {cvUrl.split("/").pop()}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-2 shrink-0">
                <Label htmlFor="cv-upload" className="cursor-pointer block">
                  <div className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-neutral-750 bg-neutral-800 px-4 py-2 text-sm text-neutral-350 transition-colors hover:bg-neutral-700 hover:text-white font-mono">
                    <Lucide.Upload className="size-4" />
                    {uploadingCv ? "Uploading..." : "Upload PDF CV"}
                  </div>
                </Label>
                <input
                  id="cv-upload"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleCvUpload}
                  disabled={uploadingCv}
                />
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Basic Info */}
        <Card className="border-neutral-800 bg-neutral-900/50 shadow-lg transition-all hover:border-neutral-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-sm font-mono">Basic Information</CardTitle>
            <CardDescription className="text-[10px] font-mono">Your identity titles and status badge text.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="about_fullname" className="font-mono text-xs text-neutral-300">Full Name</Label>
                <Input id="about_fullname" placeholder="Your full name" {...register("about_fullname")} className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10" />
                {errors.about_fullname && (
                  <p className="text-xs text-red-400">{errors.about_fullname.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="about_nickname" className="font-mono text-xs text-neutral-300">Nickname (Hello, I&apos;m ...)</Label>
                <Input id="about_nickname" placeholder="e.g. Enggi" {...register("about_nickname")} className="bg-neutral-950 border-neutral-850 text-neutral-200 font-mono text-sm h-10" />
                {errors.about_nickname && (
                  <p className="text-xs text-red-400">{errors.about_nickname.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="about_title" className="font-mono text-xs text-neutral-300">Title in Description</Label>
                <Input id="about_title" placeholder="e.g. Full-Stack Developer" {...register("about_title")} className="bg-neutral-950 border-neutral-850 text-neutral-200 font-mono text-sm h-10" />
                {errors.about_title && (
                  <p className="text-xs text-red-400">{errors.about_title.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="about_badge_title" className="font-mono text-xs text-neutral-300">Title in Profile Card Badge</Label>
                <Input id="about_badge_title" placeholder="e.g. Full-Stack Dev" {...register("about_badge_title")} className="bg-neutral-950 border-neutral-850 text-neutral-200 font-mono text-sm h-10" />
                {errors.about_badge_title && (
                  <p className="text-xs text-red-400">{errors.about_badge_title.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="about_badge_text" className="font-mono text-xs text-neutral-300">Badge Text (Open to Collaborate)</Label>
              <Input id="about_badge_text" placeholder="e.g. Open to Collaborate" {...register("about_badge_text")} className="bg-neutral-950 border-neutral-850 text-neutral-200 font-mono text-sm h-10" />
              {errors.about_badge_text && (
                <p className="text-xs text-red-400">{errors.about_badge_text.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Description Paragraphs */}
        <Card className="border-neutral-800 bg-neutral-900/50 shadow-lg transition-all hover:border-neutral-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-sm font-mono">Description</CardTitle>
            <CardDescription className="text-[10px] font-mono">
              Write your about description. Each block becomes a separate paragraph.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-5">
              {paragraphs.map((paragraph, idx) => (
                <div key={idx} className="space-y-2.5 p-5 rounded-xl border border-neutral-855 bg-neutral-950/30 border-l-2 border-l-sky-500/80 shadow-sm transition-all hover:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <Label className="font-mono text-xs text-neutral-300">Paragraph {idx + 1}</Label>
                    {paragraphs.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeParagraph(idx)}
                        className="text-neutral-500 hover:text-red-400 h-7 w-7"
                      >
                        <Lucide.X className="size-4" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={paragraph}
                    onChange={(e) => updateParagraph(idx, e.target.value)}
                    placeholder="Write a paragraph..."
                    rows={4}
                    className="bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-sky-500 focus:ring-sky-500 transition-colors leading-relaxed font-mono text-sm"
                  />
                </div>
              ))}
            </div>

            <Separator className="bg-neutral-800/60" />

            <Button type="button" variant="outline" size="sm" onClick={addParagraph} className="w-full sm:w-auto font-mono">
              <Lucide.Plus className="mr-1 size-4" />
              Add Paragraph
            </Button>
          </CardContent>
        </Card>

        {/* Social Links Card */}
        <Card className="border-neutral-800 bg-neutral-900/50 shadow-lg transition-all hover:border-neutral-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-sm font-mono">Social Media Links</CardTitle>
            <CardDescription className="text-[10px] font-mono">
              Configure your social profiles displayed globally across the site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* 2-Columns grid container for items */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {socialLinks.map((link, idx) => (
                <div key={idx} className="flex flex-col gap-3.5 rounded-lg border border-neutral-855 bg-neutral-950/60 p-4 transition-all hover:border-neutral-800 shadow-sm">
                  
                  {/* Social Link Header: Preview, Title, Delete Button */}
                  <div className="flex items-center gap-2.5 border-b border-neutral-850 pb-2.5">
                    {/* Icon Live Preview */}
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-850 bg-neutral-900 shadow-inner">
                      {(() => {
                        let IconComp: React.ComponentType<{ className?: string; style?: React.CSSProperties }> = Lucide.Globe;
                        if (link.platform === "github") IconComp = Lucide.Github;
                        else if (link.platform === "linkedin") IconComp = Lucide.Linkedin;
                        else if (link.platform === "instagram") IconComp = Lucide.Instagram;
                        else if (link.platform === "email") IconComp = Lucide.Mail;
                        else if (link.icon) {
                          const customIcon = (Lucide.icons as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[link.icon];
                          if (customIcon) IconComp = customIcon;
                        }
                        
                        // Inline preview color
                        const previewColor = link.platform === "custom" ? (link.color || "#0ea5e9") : undefined;
                        return <IconComp className="size-4.5 text-neutral-300" style={previewColor ? { color: previewColor } : undefined} />;
                      })()}
                    </div>

                    {/* Title of Link */}
                    <div className="flex-grow min-w-0">
                      <h4 className="text-[11px] font-bold text-neutral-350 truncate tracking-tight uppercase font-mono">
                        {link.label || link.platform}
                      </h4>
                    </div>

                    {/* Delete Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeSocialLink(idx)}
                      className="text-neutral-500 hover:text-red-400 h-7 w-7"
                    >
                      <Lucide.X className="size-4" />
                    </Button>
                  </div>

                  {/* Inputs Grid */}
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 pt-1">
                    <div className="space-y-1">
                      <Label className="font-mono text-xs text-neutral-300">Platform</Label>
                      <select
                        value={link.platform}
                        onChange={(e) => updateSocialLink(idx, "platform", e.target.value)}
                        className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-xs text-neutral-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono transition-colors"
                      >
                        <option value="github">GitHub</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="instagram">Instagram</option>
                        <option value="email">Email</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="font-mono text-xs text-neutral-300">Label</Label>
                      <Input
                        value={link.label}
                        onChange={(e) => updateSocialLink(idx, "label", e.target.value)}
                        placeholder="e.g. GitHub"
                        className="bg-neutral-950 border-neutral-800 text-sm text-neutral-200 focus:border-sky-500 focus:ring-sky-500 transition-colors h-10 font-mono"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <Label className="font-mono text-xs text-neutral-300">{link.platform === "email" ? "Email Address" : "URL / Link"}</Label>
                      <Input
                        value={link.href}
                        onChange={(e) => updateSocialLink(idx, "href", e.target.value)}
                        placeholder={link.platform === "email" ? "e.g. work@example.com" : "e.g. https://..."}
                        className="bg-neutral-950 border-neutral-800 text-sm text-neutral-200 focus:border-sky-500 focus:ring-sky-500 transition-colors h-10 font-mono"
                      />
                    </div>

                    {link.platform === "custom" && (
                      <div className="sm:col-span-2 grid gap-2 grid-cols-1 sm:grid-cols-2 border-t border-neutral-850/50 pt-2.5 mt-0.5">
                        <div className="space-y-1">
                          <Label className="font-mono text-xs text-neutral-300">Custom Icon</Label>
                          <Input
                            value={link.icon || ""}
                            onChange={(e) => updateSocialLink(idx, "icon", e.target.value)}
                            placeholder="e.g. Twitter"
                            className="bg-neutral-950 border-neutral-800 text-sm text-neutral-200 focus:border-sky-500 focus:ring-sky-500 transition-colors h-10 font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="font-mono text-xs text-neutral-300">Custom Color</Label>
                          <Input
                            value={link.color || ""}
                            onChange={(e) => updateSocialLink(idx, "color", e.target.value)}
                            placeholder="e.g. #1da1f2"
                            className="bg-neutral-950 border-neutral-800 text-sm text-neutral-200 focus:border-sky-500 focus:ring-sky-500 transition-colors h-10 font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>

            <Separator className="bg-neutral-800/60" />

            <Button type="button" variant="outline" size="sm" onClick={addSocialLink} className="w-full sm:w-auto font-mono">
              <Lucide.Plus className="mr-1 size-4" />
              Add Social Link
            </Button>
          </CardContent>
        </Card>
        {/* Skill Badges Card */}
        <Card className="border-neutral-800 bg-neutral-900/50 shadow-lg transition-all hover:border-neutral-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-sm font-mono">Skill Badges</CardTitle>
            <CardDescription className="text-[10px] font-mono">Select or add skill badges displayed in your about section.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
            {/* List tags */}
            <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2.5 rounded-xl bg-neutral-955/40 border border-neutral-850 flex-1">
              {skills.map((skill, idx) => (
                <Badge key={idx} variant={skill.variant} className="gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-lg">
                  {skill.name}
                  <button type="button" onClick={() => removeSkill(idx)} className="hover:text-red-450 transition-colors ml-1 cursor-pointer">
                    <Lucide.X className="size-3 text-neutral-400" />
                  </button>
                </Badge>
              ))}
              {skills.length === 0 && (
                <span className="text-[10px] text-neutral-600 font-mono italic py-1 self-center w-full text-center">No skills added yet.</span>
              )}
            </div>

            {/* Preset tags */}
            <div className="space-y-2 shrink-0">
              <p className="text-[10px] text-neutral-550 uppercase tracking-wider font-mono">Quick Add Presets:</p>
              <div className="flex flex-wrap gap-1">
                {PRESET_SKILLS.map((preset) => {
                  const isAdded = skills.some((s) => s.name.toLowerCase() === preset.name.toLowerCase());
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      disabled={isAdded}
                      onClick={() => addSkillTag(preset.name, preset.variant)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all ${
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

            {/* Add Custom Skill Tag */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1 shrink-0">
              <Input
                placeholder="Custom skill tag (e.g. Docker)"
                value={customSkillName}
                onChange={(e) => setCustomSkillName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
                className="text-xs bg-neutral-955 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 h-10 w-full rounded-lg"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCustomSkill}
                className="w-full sm:w-auto shrink-0 h-10 px-4 rounded-lg border-neutral-800"
              >
                <Lucide.Plus className="size-4 mr-1.5" />
                Add Skill
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SEO & Metadata Card */}
        <Card className="border-neutral-800 bg-neutral-900/50 shadow-lg transition-all hover:border-neutral-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-sm font-mono">SEO & Search Engine Settings</CardTitle>
            <CardDescription className="text-[10px] font-mono">Configure tags that help search engines index your website correctly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="seo_title" className="font-mono text-xs text-neutral-300">Search Engine Title</Label>
                <Input id="seo_title" placeholder="e.g. Enggi Pratama | Full-Stack Developer" {...register("seo_title")} className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10" />
                {errors.seo_title && (
                  <p className="text-xs text-red-400">{errors.seo_title.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="seo_keywords" className="font-mono text-xs text-neutral-300">Keywords (Comma-separated)</Label>
                <Input id="seo_keywords" placeholder="e.g. Enggi Pratama, portfolio, web developer, nextjs" {...register("seo_keywords")} className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10" />
                {errors.seo_keywords && (
                  <p className="text-xs text-red-400">{errors.seo_keywords.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="seo_description" className="font-mono text-xs text-neutral-300">Meta Description</Label>
              <Textarea
                id="seo_description"
                placeholder="Write a brief summary of your portfolio for search engine results..."
                rows={3}
                {...register("seo_description")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 leading-relaxed font-mono text-sm"
              />
              {errors.seo_description && (
                <p className="text-xs text-red-400">{errors.seo_description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Footer */}
        <div className="flex justify-end border-t border-neutral-900/60 pt-6">
          <Button type="submit" disabled={saving} className="min-w-[120px] w-full sm:w-auto bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-400 hover:to-purple-400 text-white font-mono rounded-lg transition-all duration-300 shadow-md shadow-sky-500/10 border-0 h-10 text-xs font-bold">
            {saving && <Lucide.Loader2 className="mr-2 size-4 animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
