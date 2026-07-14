"use client";

import { useState, useRef, useEffect } from "react";
import { NotificationPortal, Notification, NotificationAction } from "./notification-portal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { nanoid } from "nanoid";
import { Mail, MapPin, Clock, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SocialLink, type SocialLinkData } from "@/components/ui/social-link";

const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(5, "Message must be at least 5 characters"),
  website: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [buttonStatus, setButtonStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const lastFormData = useRef<ContactFormData | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([
    { label: "Github", href: "https://github.com/enggipratama", platform: "github" },
    { label: "LinkedIn", href: "https://linkedin.com/in/enggipratama", platform: "linkedin" },
    { label: "Instagram", href: "https://instagram.com/enggiipratama", platform: "instagram" },
    { label: "Email", href: "work.enggipratama@gmail.com", platform: "email" },
  ]);
  const [location, setLocation] = useState("Indonesia");
  const [responseTime, setResponseTime] = useState("Usually within 24 hours");

  const contactEmail =
    socialLinks.find((l) => l.platform === "email")?.href || "work.enggipratama@gmail.com";

  useEffect(() => {
    async function fetchContactSettings() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["social_links", "contact_location", "contact_response_time"]);
        if (!error && data) {
          const socialsRow = data.find((r) => r.key === "social_links");
          if (socialsRow && Array.isArray(socialsRow.value)) {
            setSocialLinks(socialsRow.value);
          }

          const locationRow = data.find((r) => r.key === "contact_location");
          if (locationRow && locationRow.value) setLocation(locationRow.value);

          const responseRow = data.find((r) => r.key === "contact_response_time");
          if (responseRow && responseRow.value) setResponseTime(responseRow.value);
        }
      } catch {
        // ignore
      }
    }
    fetchContactSettings();
  }, []);



  const addNotification = (
    message: string, 
    type: "success" | "error" | "info",
    action?: NotificationAction,
    undo?: () => void
  ) => {
    // Prevent duplicate toast spamming
    const isDuplicate = notifications.some((n) => n.message === message);
    if (isDuplicate) return;

    const id = nanoid();
    const duration = type === "error" ? 6000 : 4000;
    setNotifications((prev) => [...prev, { id, message, type, duration, action, undo }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("turnstile-script")) {
      const script = document.createElement("script");
      script.id = "turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    let widgetId: string | null = null;
    const interval = setInterval(() => {
      const win = typeof window !== "undefined" ? (window as unknown as {
        turnstile?: {
          render: (
            el: string,
            options: {
              sitekey: string;
              callback: (token: string) => void;
              "error-callback"?: () => void;
              "expired-callback"?: () => void;
            }
          ) => string;
          remove: (id: string) => void;
        };
      }) : null;

      if (win && win.turnstile) {
        clearInterval(interval);
        try {
          const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
          widgetId = win.turnstile.render("#turnstile-container", {
            sitekey: siteKey,
            callback: (token: string) => {
              setTurnstileToken(token);
            },
            "error-callback": () => {
              setTurnstileToken(null);
              addNotification(
                "Captcha gagal dimuat. Periksa koneksi internet atau izin domain di Cloudflare Turnstile.",
                "error"
              );
            },
            "expired-callback": () => {
              setTurnstileToken(null);
              addNotification("Captcha kedaluwarsa, silakan coba lagi.", "error");
            },
          });
        } catch (e) {
          console.error("Turnstile rendering failed", e);
        }
      }
    }, 200);

    return () => {
      clearInterval(interval);
      const win = typeof window !== "undefined" ? (window as unknown as {
        turnstile?: {
          remove: (id: string) => void;
        };
      }) : null;
      if (widgetId && win && win.turnstile) {
        win.turnstile.remove(widgetId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ContactFormData) => {
    if (data.website) return;
    if (!turnstileToken) {
      setButtonStatus("idle");
      addNotification("Please complete the Captcha check.", "error");
      return;
    }
    lastFormData.current = data;
    setButtonStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, turnstileToken }),
      });

      const result = await res.json();

      if (res.ok) {
        setButtonStatus("success");
        addNotification(`Thanks ${data.name}! Message sent successfully.`, "success");
        reset();
        setTimeout(() => setButtonStatus("idle"), 3000);
      } else {
        setButtonStatus("error");
        addNotification(result.error || "Failed to send. Please try again.", "error");
        setTimeout(() => setButtonStatus("idle"), 3000);
      }
    } catch {
      setButtonStatus("error");
      addNotification("Network error occurred", "error");
      setTimeout(() => setButtonStatus("idle"), 3000);
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-slate-50/50 dark:bg-black font-mono">
      {/* Background Decorative Glows for Light Mode */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-sky-200/10 blur-[120px] dark:hidden" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-purple-200/10 blur-[120px] dark:hidden" />

      {/* Notifications - Portal to body for true fixed positioning */}
      <NotificationPortal
        notifications={notifications}
        onRemove={removeNotification}
        onClearAll={clearAllNotifications}
      />

      <div className="mx-auto max-w-6xl px-4 pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20">
        {/* Header */}
        <div className="text-center mb-10">
          <SectionHeader
            title="Let&apos;s Work Together"
            subtitle="Have a project in mind? I&apos;d love to hear about it."
            gradient
          />
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="rounded-2xl border border-neutral-300/50 bg-white/70 p-6 sm:p-8 shadow-lg shadow-neutral-200/30 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.04] dark:shadow-2xl dark:shadow-black/50">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                Contact Information
              </h2>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Email</p>
                    <a href={`mailto:${contactEmail}`} className="text-sm font-medium text-neutral-900 dark:text-white hover:text-sky-500 transition-colors">
                      {contactEmail}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Location</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {location}
                    </p>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Response Time</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {responseTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-center">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">Or connect via</p>
<div className="flex flex-wrap gap-3 justify-center">
                   {socialLinks.map((link) => (
                     <SocialLink key={link.label} link={link} variant="contact" />
                   ))}
                 </div>
              </div>
            </div>

            {/* Giscus Link */}
            <div className="mt-4 text-center lg:text-left">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Prefer public discussion?{" "}
                <Link href="/giscus" className="text-sky-500 hover:underline">
                  Visit Giscus →
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="rounded-2xl border border-neutral-300/50 bg-white/80 p-6 sm:p-8 shadow-xl shadow-neutral-200/30 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.04] dark:shadow-2xl dark:shadow-black/50">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">
                Send a Message
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSubmit(onSubmit, () => {
                    setButtonStatus("idle");
                    addNotification("Please check your form inputs", "error");
                  })(e);
                }}
                className="space-y-5"
              >
                <input type="text" className="hidden" {...register("website")} />

                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...register("name")}
                    className={cn(
                      "h-12 w-full rounded-xl border border-neutral-300/40 bg-neutral-100/50 px-4 text-base text-neutral-900 placeholder:text-neutral-400 transition-all outline-none md:text-sm",
                      "hover:border-neutral-400/60 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10",
                      "dark:border-white/[0.08] dark:bg-black/50 dark:text-white dark:placeholder:text-neutral-500",
                      "dark:hover:border-white/20 dark:focus:border-sky-400 dark:focus:ring-sky-400/10",
                      errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-500/20"
                    )}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                    className={cn(
                      "h-12 w-full rounded-xl border border-neutral-300/40 bg-neutral-100/50 px-4 text-base text-neutral-900 placeholder:text-neutral-400 transition-all outline-none md:text-sm",
                      "hover:border-neutral-400/60 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10",
                      "dark:border-white/[0.08] dark:bg-black/50 dark:text-white dark:placeholder:text-neutral-500",
                      "dark:hover:border-white/20 dark:focus:border-sky-400 dark:focus:ring-sky-400/10",
                      errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-500/20"
                    )}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Subject <span className="text-red-500">*</span>
                  </Label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Project collaboration"
                    {...register("subject")}
                    className={cn(
                      "h-12 w-full rounded-xl border border-neutral-300/40 bg-neutral-100/50 px-4 text-base text-neutral-900 placeholder:text-neutral-400 transition-all outline-none md:text-sm",
                      "hover:border-neutral-400/60 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10",
                      "dark:border-white/[0.08] dark:bg-black/50 dark:text-white dark:placeholder:text-neutral-500",
                      "dark:hover:border-white/20 dark:focus:border-sky-400 dark:focus:ring-sky-400/10",
                      errors.subject && "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-500/20"
                    )}
                  />
                  {errors.subject && (
                    <p className="text-xs text-red-500">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Your Message <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Tell me about your project..."
                    {...register("message")}
                    className={cn(
                      "w-full rounded-xl border border-neutral-300/40 bg-neutral-100/50 px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 transition-all outline-none resize-none md:text-sm",
                      "hover:border-neutral-400/60 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10",
                      "dark:border-white/[0.08] dark:bg-black/50 dark:text-white dark:placeholder:text-neutral-500",
                      "dark:hover:border-white/20 dark:focus:border-sky-400 dark:focus:ring-sky-400/10",
                      errors.message && "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-500/20"
                    )}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500">{errors.message.message}</p>
                  )}
                </div>

                {/* Cloudflare Turnstile Captcha */}
                <div className="flex justify-center my-2 select-none">
                  <div id="turnstile-container" className="mx-auto" />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={buttonStatus === "loading"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "group relative w-full overflow-hidden rounded-xl px-6 py-3 text-sm font-bold text-white transition-all",
                    buttonStatus === "success" && "bg-green-500",
                    buttonStatus === "error" && "bg-red-500",
                    (buttonStatus === "idle" || buttonStatus === "loading") && "bg-gradient-to-r from-sky-500 to-purple-500",
                    buttonStatus === "idle" && "hover:shadow-lg hover:shadow-sky-500/25",
                    buttonStatus === "loading" && "cursor-not-allowed opacity-80"
                  )}
                >
                  {buttonStatus === "loading" && (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </span>
                  )}
                  {buttonStatus === "success" && (
                    <span className="flex items-center justify-center gap-2">
                      Message Sent!
                    </span>
                  )}
                  {buttonStatus === "error" && (
                    <span className="flex items-center justify-center gap-2">
                      Failed to Send
                    </span>
                  )}
                  {buttonStatus === "idle" && (
                    <span className="relative flex items-center justify-center gap-2">
                      <Send size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      Send Message
                    </span>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
