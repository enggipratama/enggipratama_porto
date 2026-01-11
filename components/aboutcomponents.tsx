"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import { Spotlight } from "./ui/spotlight";
import { CometCardProfile } from "@/components/cometcard";

export function SpotlightPreview() {
  const socials = [
    {
      label: "Github",
      href: "https://github.com/enggipratama",
      icon: <Github size={20} />,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/enggipratama",
      icon: <Linkedin size={20} />,
    },
    {
      label: "Instagram",
      href: "https://instagram.com/enggiipratama",
      icon: <Instagram size={20} />,
    },
    {
      label: "Email",
      href: "mailto:work.enggipratama@gmail.com",
      icon: <Mail size={20} />,
    },
  ];

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden rounded-md bg-white p-4 antialiased transition-colors duration-500 dark:bg-black/[0.96] md:min-h-[25rem] md:p-10">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 select-none opacity-15",
          "[background-size:30px_30px]",
          "[mask-image:radial-gradient(ellipse_at_center,black,transparent)]",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)]"
        )}
      />

      <Spotlight
        className="-top-20 left-0 md:-top-20 md:left-60 text-neutral-300/50 dark:text-white"
        fill="currentColor"
      />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 md:flex-row md:gap-10">
        <div className="flex max-w-2xl flex-col items-center font-mono md:items-start">
          <h1 className="flex items-center gap-3 bg-clip-text text-4xl font-bold leading-tight md:text-5xl">
            Hi there 🙌
          </h1>

          <p className="mt-4 text-justify text-sm leading-relaxed text-neutral-700 dark:text-neutral-400 md:text-left">
            My name is{" "}
            <span className="font-bold italic text-blue-600 dark:text-blue-400">
              Muhammad Einggi Gusti P
            </span>
            . I graduated with a{" "}
            <span className="text-neutral-900 italic dark:text-neutral-100">
              Bachelor&apos;s Degree in Computer Science
            </span>{" "}
            from the University of Muhammadiyah Malang in 2024. With a deep
            passion for technology, I am constantly evolving my skill set and am
            eager to contribute to innovative projects in dynamic environments.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {socials.map(({ href, icon, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-xl border border-neutral-200 bg-white p-3 text-neutral-700 shadow-sm transition-colors hover:border-blue-500/50 hover:text-blue-600 dark:border-neutral-700 dark:bg-[#161616] dark:text-neutral-300 dark:hover:text-blue-400"
              >
                {icon}
              </motion.a>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0">
          <CometCardProfile />
        </div>
      </div>
    </section>
  );
}
