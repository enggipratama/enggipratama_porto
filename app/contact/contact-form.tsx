"use client";

import { useState, useRef } from "react";
import { NotificationPortal, Notification, NotificationAction } from "./notification-portal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { nanoid } from "nanoid";
import { Mail, MapPin, Clock, Github, Linkedin, Instagram, Send, Loader2 } from "lucide-react";
import Link from "next/link";

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



const socials = [
  { icon: Github, href: "https://github.com/enggipratama", label: "GitHub", color: "hover:text-neutral-900 dark:hover:text-white" },
  { icon: Linkedin, href: "https://linkedin.com/in/enggipratama", label: "LinkedIn", color: "hover:text-blue-600" },
  { icon: Instagram, href: "https://instagram.com/enggiipratama", label: "Instagram", color: "hover:text-pink-600" },
  { icon: Mail, href: "mailto:work.enggipratama@gmail.com", label: "Email", color: "hover:text-sky-500" },
];

export default function ContactForm() {
  const [buttonStatus, setButtonStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const lastFormData = useRef<ContactFormData | null>(null);



  const addNotification = (
    message: string, 
    type: "success" | "error" | "info",
    action?: NotificationAction,
    undo?: () => void
  ) => {
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
    lastFormData.current = data;
    setButtonStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
    <section className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-black font-mono">
      {/* Notifications - Portal to body for true fixed positioning */}
      <NotificationPortal
        notifications={notifications}
        onRemove={removeNotification}
        onClearAll={clearAllNotifications}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-sky-500 to-purple-500 bg-clip-text text-transparent">
            Let&apos;s Work Together
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Have a project in mind? I&apos;d love to hear about it.
          </p>
        </motion.div>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="rounded-2xl bg-gradient-to-br from-sky-500/10 via-purple-500/10 to-pink-500/10 dark:from-sky-500/5 dark:via-purple-500/5 dark:to-pink-500/5 p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800">
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
                    <a href="mailto:work.enggipratama@gmail.com" className="text-sm font-medium text-neutral-900 dark:text-white hover:text-sky-500 transition-colors">
                      work.enggipratama@gmail.com
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
                      Indonesia
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
                      Usually within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">Or connect via</p>
                <div className="flex gap-3">
                  {socials.map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-xl bg-neutral-200 p-2.5 text-neutral-700 transition-colors hover:bg-sky-500 hover:text-white dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-sky-500 dark:hover:text-white"
                      aria-label={label}
                    >
                      <Icon size={18} />
                    </motion.a>
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
            <div className="rounded-2xl bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xl border border-neutral-200 dark:border-neutral-800">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">
                Send a Message
              </h2>

              <form
                onSubmit={handleSubmit(onSubmit, () => {
                  setButtonStatus("idle");
                  addNotification("Please check your form inputs", "error");
                })}
                className="space-y-5"
              >
                <input type="text" className="hidden" {...register("website")} />

                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...register("name")}
                    className={cn(
                      "h-11 rounded-xl border-neutral-200 bg-neutral-50 text-base focus:border-sky-500 focus:ring-sky-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white md:text-sm",
                      errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
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
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                    className={cn(
                      "h-11 rounded-xl border-neutral-200 bg-neutral-50 text-base focus:border-sky-500 focus:ring-sky-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white md:text-sm",
                      errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
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
                  <Input
                    id="subject"
                    placeholder="Project collaboration"
                    {...register("subject")}
                    className={cn(
                      "h-11 rounded-xl border-neutral-200 bg-neutral-50 text-base focus:border-sky-500 focus:ring-sky-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white md:text-sm",
                      errors.subject && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
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
                      "w-full rounded-xl border-neutral-200 bg-neutral-50 px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 resize-none md:text-sm",
                      errors.message && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500">{errors.message.message}</p>
                  )}
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
