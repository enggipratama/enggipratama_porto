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
import { Textarea } from "@/components/ui/textarea";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const footerSchema = z.object({
  footer_name: z.string().min(1, "Footer name is required"),
  footer_credit: z.string().min(1, "Credit name is required"),
  footer_tagline: z.string().min(1, "Description is required"),
  contact_location: z.string().min(1, "Location is required"),
  contact_response_time: z.string().min(1, "Response time is required"),
  giscus_repo: z.string().min(1, "Giscus repo is required"),
  giscus_repo_id: z.string().min(1, "Giscus repo ID is required"),
  giscus_category_id: z.string().min(1, "Giscus category ID is required"),
});

type FooterFormValues = z.infer<typeof footerSchema>;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function FooterEditorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FooterFormValues>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
      footer_name: "",
      footer_credit: "",
      footer_tagline: "",
      contact_location: "",
      contact_response_time: "",
      giscus_repo: "",
      giscus_repo_id: "",
      giscus_category_id: "",
    },
  });

  // Fetch current data
  useEffect(() => {
    async function fetchData() {
      try {
        const keys = [
          "footer_name",
          "footer_credit",
          "footer_tagline",
          "contact_location",
          "contact_response_time",
          "giscus_repo",
          "giscus_repo_id",
          "giscus_category_id"
        ];
        const params = keys.map((k) => `key=${k}`).join("&");
        const res = await fetch(`/api/admin/settings?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        reset({
          footer_name: data.footer_name ?? "",
          footer_credit: data.footer_credit ?? "",
          footer_tagline: data.footer_tagline ?? "",
          contact_location: data.contact_location ?? "",
          contact_response_time: data.contact_response_time ?? "",
          giscus_repo: data.giscus_repo ?? "",
          giscus_repo_id: data.giscus_repo_id ?? "",
          giscus_category_id: data.giscus_category_id ?? "",
        });
      } catch {
        toast.error("Failed to load footer settings");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [reset]);

  // Save
  async function onSave(values: FooterFormValues) {
    setSaving(true);
    try {
      const entries = [
        { key: "footer_name", value: values.footer_name },
        { key: "footer_credit", value: values.footer_credit },
        { key: "footer_tagline", value: values.footer_tagline },
        { key: "contact_location", value: values.contact_location },
        { key: "contact_response_time", value: values.contact_response_time },
        { key: "giscus_repo", value: values.giscus_repo },
        { key: "giscus_repo_id", value: values.giscus_repo_id },
        { key: "giscus_category_id", value: values.giscus_category_id },
      ];

      for (const entry of entries) {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
        if (!res.ok) throw new Error(`Failed to save ${entry.key}`);
      }
      toast.success("Settings saved successfully");
      router.refresh();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-800" />
        <div className="h-64 animate-pulse rounded-xl bg-neutral-800/50" />
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
        <h1 className="font-mono text-2xl font-bold text-white">Footer Section</h1>
        <p className="mt-1 font-mono text-sm text-neutral-400">
          Manage the brand name, credit, and description shown in the footer.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="max-w-4xl mx-auto space-y-8">
        <Card className="border-neutral-800 bg-neutral-900/50 shadow-lg transition-all hover:border-neutral-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-sm font-mono">Footer Content</CardTitle>
            <CardDescription className="text-[10px] font-mono">
              These values appear at the bottom of every page across the site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="footer_name" className="font-mono text-xs text-neutral-300">Footer Name (Brand)</Label>
              <Input
                id="footer_name"
                placeholder="e.g. Enggi Pratama"
                {...register("footer_name")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
              />
              {errors.footer_name && (
                <p className="text-xs text-red-400">{errors.footer_name.message}</p>
              )}
              <p className="font-mono text-[11px] text-neutral-500">
                The logo/brand text shown on the left of the footer.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="footer_credit" className="font-mono text-xs text-neutral-300">Credit Name</Label>
              <Input
                id="footer_credit"
                placeholder="e.g. Enggi Pratama"
                {...register("footer_credit")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
              />
              {errors.footer_credit && (
                <p className="text-xs text-red-400">{errors.footer_credit.message}</p>
              )}
              <p className="font-mono text-[11px] text-neutral-500">
                The name shown after &ldquo;Made with ♥ by ...&rdquo; at the bottom.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="footer_tagline" className="font-mono text-xs text-neutral-300">Description (Tagline)</Label>
              <Textarea
                id="footer_tagline"
                placeholder="e.g. Feel free to reach out. — Say hello anytime!"
                rows={3}
                {...register("footer_tagline")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 leading-relaxed font-mono text-sm"
              />
              {errors.footer_tagline && (
                <p className="text-xs text-red-400">{errors.footer_tagline.message}</p>
              )}
              <p className="font-mono text-[11px] text-neutral-500">
                The small line of text under the brand name in the footer.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Page Settings Card */}
        <Card className="border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-lg transition-all hover:border-neutral-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-sm font-mono">Contact Details</CardTitle>
            <CardDescription className="text-[10px] text-neutral-400 font-mono">
              These values appear on the public contact form page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact_location" className="font-mono text-xs text-neutral-300">Physical Location</Label>
              <Input
                id="contact_location"
                placeholder="e.g. Indonesia"
                {...register("contact_location")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
              />
              {errors.contact_location && (
                <p className="text-xs text-red-400">{errors.contact_location.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact_response_time" className="font-mono text-xs text-neutral-300">Average Response Time</Label>
              <Input
                id="contact_response_time"
                placeholder="e.g. Usually within 24 hours"
                {...register("contact_response_time")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
              />
              {errors.contact_response_time && (
                <p className="text-xs text-red-400">{errors.contact_response_time.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Giscus Integration Settings Card */}
        <Card className="border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-lg transition-all hover:border-neutral-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-sm font-mono">Giscus Comments Configuration</CardTitle>
            <CardDescription className="text-[10px] text-neutral-400 font-mono">
              Configure parameters for the public discussions section powered by Giscus.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="giscus_repo" className="font-mono text-xs text-neutral-300">GitHub Repository</Label>
              <Input
                id="giscus_repo"
                placeholder="e.g. username/repo"
                {...register("giscus_repo")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
              />
              {errors.giscus_repo && (
                <p className="text-xs text-red-400">{errors.giscus_repo.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="giscus_repo_id" className="font-mono text-xs text-neutral-300">Repository ID</Label>
              <Input
                id="giscus_repo_id"
                placeholder="e.g. R_kgDOL-qXqQ"
                {...register("giscus_repo_id")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
              />
              {errors.giscus_repo_id && (
                <p className="text-xs text-red-400">{errors.giscus_repo_id.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="giscus_category_id" className="font-mono text-xs text-neutral-300">Category ID</Label>
              <Input
                id="giscus_category_id"
                placeholder="e.g. DIC_kwDOL-qXqc4C0tG-"
                {...register("giscus_category_id")}
                className="bg-neutral-950 border-neutral-850 text-neutral-200 focus-visible:ring-sky-500 font-mono text-sm h-10"
              />
              {errors.giscus_category_id && (
                <p className="text-xs text-red-400">{errors.giscus_category_id.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
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
