"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { StatefulButton } from "@/components/buttonsend";
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb_contact";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { nanoid } from "nanoid";

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

type Notification = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

export default function ContactForm() {
  const [buttonStatus, setButtonStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    const id = nanoid();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
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
        addNotification("Pesan berhasil dikirim!", "success");
        reset();
        setTimeout(() => setButtonStatus("idle"), 3000);
      } else {
        setButtonStatus("error");
        addNotification(result.error || "Gagal mengirim pesan", "error");
        setTimeout(() => setButtonStatus("idle"), 3000);
      }
    } catch {
      setButtonStatus("error");
      addNotification("Terjadi kesalahan jaringan", "error");
      setTimeout(() => setButtonStatus("idle"), 3000);
    }
  };

  return (
    <section className="max-w-2xl mx-auto font-mono px-4 py-16 relative">
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-100 flex flex-col gap-2 w-full max-w-xs md:max-w-sm">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={cn(
                "px-4 py-2 rounded-lg shadow-xl border text-xs font-bold flex items-center justify-center text-center",
                notif.type === "success" &&
                  "bg-green-500 border-green-600 text-white",
                notif.type === "error" &&
                  "bg-red-500 border-red-600 text-white",
                notif.type === "info" &&
                  "bg-blue-500 border-blue-600 text-white"
              )}
            >
              {notif.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="w-full bg-white dark:bg-black px-5 mb-10 text-center">
        <h2 className="text-2xl md:text-4xl mb-2 text-black dark:text-white font-bold">
          Contact Me 📩
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm">
          Got a question or want to collaborate? Say hello anytime!
        </p>
      </div>

      <div className="mb-4 px-5">
        <BreadcrumbWithCustomSeparator />
      </div>

      <div className="shadow-inner mx-auto w-full rounded-2xl bg-gray-200 p-8 dark:bg-black border border-gray-300 dark:border-gray-900">
        <form
          onSubmit={handleSubmit(onSubmit, () => {
            setButtonStatus("idle");
            addNotification("Mohon periksa kembali formulir Anda", "error");
          })}
          className="space-y-6"
        >
          <input type="text" className="hidden" {...register("website")} />

          <LabelInputContainer>
            <Label htmlFor="name">
              Full Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Your Name"
              {...register("name")}
              className={
                errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />
            {errors.name && (
              <p className="text-red-500 text-xs text-right">
                {errors.name.message}
              </p>
            )}
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="email">
              Email Address<span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              placeholder="project@me.com"
              type="email"
              {...register("email")}
              className={
                errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />
            {errors.email && (
              <p className="text-red-500 text-xs text-right">
                {errors.email.message}
              </p>
            )}
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="subject">
              Subject<span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              placeholder="Inquiry / Collaboration"
              {...register("subject")}
              className={
                errors.subject
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {errors.subject && (
              <p className="text-red-500 text-xs text-right">
                {errors.subject.message}
              </p>
            )}
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="message">
              Your Message<span className="text-red-500">*</span>
            </Label>
            <textarea
              id="message"
              rows={5}
              {...register("message")}
              placeholder="Write your message here..."
              className={cn(
                "flex w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 transition duration-400",
                errors.message
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600"
              )}
            />
            {errors.message && (
              <p className="text-red-500 text-xs text-right">
                {errors.message.message}
              </p>
            )}
          </LabelInputContainer>

          <div className="pt-4">
            <StatefulButton status={buttonStatus}>Send Message</StatefulButton>
          </div>
        </form>
      </div>

      <div className="flex flex-col items-center justify-center mt-10 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-gray-600 dark:text-gray-400">
            Lets discuss with us -
          </span>
          <a
            href="/giscus"
            className="flex items-center gap-1 group text-blue-500 hover:text-sky-500 transition-colors"
          >
            <span className="font-bold underline-offset-2 group-hover:underline">
              Giscus
            </span>
            <Image
              src="/Images/giscus.png"
              alt="Giscus"
              width={24}
              height={24}
              className="w-5 h-5 group-hover:scale-110 transition-transform"
            />
          </a>
        </div>
        <span className="text-gray-500 italic dark:text-gray-400 text-xs mt-1">
          Powered by Github
        </span>
      </div>
    </section>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
