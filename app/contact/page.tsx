"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { StatefulButton } from "@/components/buttonsend";
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb";

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
  const [buttonStatus, setButtonStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [serverError, setServerError] = useState<string | null>(null);

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
    setServerError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setButtonStatus("success");
        reset();
        setTimeout(() => setButtonStatus("idle"), 3000);
      } else {
        setButtonStatus("error");
        setServerError(result.error || "Failed to send message");
        setTimeout(() => setButtonStatus("idle"), 3000);
      }
    } catch (error) {
      setButtonStatus("error");
      setServerError("Network error, please try again.");
      setTimeout(() => setButtonStatus("idle"), 3000);
    }
  };

  return (
    <section className="max-w-2xl mx-auto font-mono px-4 py-16">
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
          onSubmit={handleSubmit(onSubmit, () => setButtonStatus("idle"))}
          className="space-y-6"
        >
          {/* Honeypot */}
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
                "flex w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-[2px] transition duration-400",
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

          {serverError && (
            <p className="text-red-500 text-center text-sm font-medium">
              {serverError}
            </p>
          )}

          <div className="pt-4">
            <StatefulButton status={buttonStatus}>Send Message</StatefulButton>
          </div>
        </form>
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
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
