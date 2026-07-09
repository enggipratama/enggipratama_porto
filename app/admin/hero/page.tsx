"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import * as Lucide from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const heroSchema = z.object({
  hero_name: z.string().min(1, "Name is required"),
  hero_tagline: z.string().min(1, "Tagline is required"),
  hero_badge_text: z.string().min(1, "Badge text is required"),
});

type HeroFormValues = z.infer<typeof heroSchema>;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function HeroEditorPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flipWords, setFlipWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: { hero_name: "", hero_tagline: "", hero_badge_text: "" },
  });

  const watchedValues = watch();

  // Fetch current data
  useEffect(() => {
    async function fetchData() {
      try {
        const keys = ["hero_name", "hero_tagline", "hero_badge_text", "text_flip_words"];
        const params = keys.map((k) => `key=${k}`).join("&");
        const res = await fetch(`/api/admin/settings?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        reset({
          hero_name: data.hero_name ?? "",
          hero_tagline: data.hero_tagline ?? "",
          hero_badge_text: data.hero_badge_text ?? "",
        });
        setFlipWords(Array.isArray(data.text_flip_words) ? data.text_flip_words : []);
      } catch {
        toast.error("Failed to load hero settings");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [reset]);

  // Add flip word
  function addFlipWord() {
    const trimmed = newWord.trim();
    if (!trimmed) return;
    if (flipWords.includes(trimmed)) {
      toast.error("Word already exists");
      return;
    }
    setFlipWords((prev) => [...prev, trimmed]);
    setNewWord("");
  }

  // Remove flip word
  function removeFlipWord(index: number) {
    setFlipWords((prev) => prev.filter((_, i) => i !== index));
  }

  // Save
  async function onSave(values: HeroFormValues) {
    setSaving(true);
    try {
      const entries = [
        { key: "hero_name", value: values.hero_name },
        { key: "hero_tagline", value: values.hero_tagline },
        { key: "hero_badge_text", value: values.hero_badge_text },
        { key: "text_flip_words", value: flipWords },
      ];
      for (const entry of entries) {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
        if (!res.ok) throw new Error(`Failed to save ${entry.key}`);
      }
      toast.success("Hero section saved successfully");
    } catch {
      toast.error("Failed to save hero settings");
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
      <div className="border-b border-neutral-800 pb-5">
        <h1 className="font-mono text-2xl font-bold text-white">Hero Section</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Manage the hero section content of your portfolio.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="max-w-4xl mx-auto space-y-8">
        
        {/* Basic Info */}
        <Card className="border-neutral-800 bg-neutral-900/50 shadow-lg transition-all hover:border-neutral-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-white">Basic Information</CardTitle>
            <CardDescription>Your name, tagline, and badge text displayed in the hero.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="hero_name" className="text-neutral-300">Name</Label>
                <Input id="hero_name" placeholder="Your name" {...register("hero_name")} className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500" />
                {errors.hero_name && (
                  <p className="text-xs text-red-400">{errors.hero_name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="hero_badge_text" className="text-neutral-300">Badge Text</Label>
                <Input id="hero_badge_text" placeholder="e.g. Available for Opportunities" {...register("hero_badge_text")} className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500" />
                {errors.hero_badge_text && (
                  <p className="text-xs text-red-400">{errors.hero_badge_text.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hero_tagline" className="text-neutral-300">Tagline</Label>
              <Textarea
                id="hero_tagline"
                placeholder="Your tagline..."
                rows={3}
                {...register("hero_tagline")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 leading-relaxed"
              />
              {errors.hero_tagline && (
                <p className="text-xs text-red-400">{errors.hero_tagline.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Flip Words */}
        <Card className="border-neutral-800 bg-neutral-900/50 shadow-lg transition-all hover:border-neutral-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-white">Text Flip Words</CardTitle>
            <CardDescription>Words that cycle in the hero text animation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2.5 p-3.5 rounded-lg border border-neutral-855 bg-neutral-950/30">
              {flipWords.map((word, idx) => (
                <Badge key={idx} variant="sky" size="md" className="gap-1.5 px-3 py-1 bg-sky-950/20 border border-sky-900/30 text-sky-400 hover:bg-sky-950/40 transition-colors">
                  {word}
                  <button
                    type="button"
                    onClick={() => removeFlipWord(idx)}
                    className="ml-1 rounded-full p-0.5 hover:bg-sky-500/20 text-sky-400 transition-colors"
                  >
                    <Lucide.X className="size-3" />
                  </button>
                </Badge>
              ))}
              {flipWords.length === 0 && (
                <p className="text-xs text-neutral-500 font-mono py-1">No flip words added yet.</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Add a word (e.g. Developer, Designer)..."
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFlipWord();
                  }
                }}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 w-full h-10"
              />
              <Button type="button" variant="outline" size="sm" onClick={addFlipWord} className="w-full sm:w-auto shrink-0 h-10 px-4">
                <Lucide.Plus className="mr-1.5 size-4" />
                Add Word
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card className="border-neutral-800 bg-neutral-900/50 shadow-lg transition-all hover:border-neutral-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Lucide.Eye className="size-4" />
              Live Preview
            </CardTitle>
            <CardDescription>Visual mock-up of how the hero content is presented.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 p-8 text-center shadow-inner">
              {/* Background Grid Pattern Overlay */}
              <div className="pointer-events-none absolute inset-0 select-none opacity-[0.04] [background-size:20px_20px] [background-image:linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)]" />

              {/* Status Badge */}
              {watchedValues.hero_badge_text && (
                <div className="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-emerald-950/30 bg-emerald-950/10 px-3 py-1.5 text-[10px] font-bold text-emerald-400 font-mono shadow-sm uppercase tracking-wider mb-6">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  {watchedValues.hero_badge_text}
                </div>
              )}

              {/* Flip Word Animation Preview */}
              <div className="relative z-10 mb-2 flex flex-col items-center justify-center gap-1 font-mono text-xl font-bold tracking-tight">
                {flipWords.length > 0 ? (
                  <div className="flex items-center gap-1 text-sm sm:text-base text-neutral-450">
                    <span>I&apos;m a</span>
                    <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent underline decoration-sky-500/30">
                      {flipWords[0]}
                    </span>
                  </div>
                ) : (
                  <span className="text-neutral-500 text-xs">No Flip Words Added</span>
                )}
                
                {/* Name */}
                <span className="mt-2 block bg-gradient-to-b from-neutral-600 to-white bg-clip-text text-lg tracking-[0.2em] text-transparent uppercase">
                  {watchedValues.hero_name || "Your Name"}.
                </span>
              </div>

              <Separator className="mx-auto my-5 w-12 bg-neutral-800" />

              {/* Tagline */}
              <p className="relative z-10 mx-auto max-w-lg text-xs italic text-neutral-400 leading-relaxed">
                &ldquo;{watchedValues.hero_tagline || "Your tagline..."}&rdquo;
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Footer */}
        <div className="flex justify-end border-t border-neutral-800 pt-6">
          <Button type="submit" disabled={saving} className="min-w-[120px] w-full sm:w-auto">
            {saving && <Lucide.Loader2 className="mr-2 size-4 animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
