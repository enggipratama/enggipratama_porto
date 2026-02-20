"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Mail, Download } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const socials = [
  {
    label: "Github",
    href: "https://github.com/enggipratama",
    icon: <Github size={18} />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/enggipratama",
    icon: <Linkedin size={18} />,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/enggiipratama",
    icon: <Instagram size={18} />,
  },
  {
    label: "Email",
    href: "mailto:work.enggipratama@gmail.com",
    icon: <Mail size={18} />,
  },
];

const skills = [
  { name: "Next.js", color: "bg-neutral-800 text-white dark:bg-white dark:text-neutral-900" },
  { name: "React", color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300" },
  { name: "TypeScript", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  { name: "Tailwind", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300" },
  { name: "Laravel", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
  { name: "PHP", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" },
  { name: "MySQL", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  { name: "Framer", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300" },
];

const badgeBaseStyle = "inline-flex shrink-0 items-center rounded-md px-2 py-1 text-[10px] font-medium sm:rounded-full sm:px-2.5 sm:text-xs";

export function SpotlightPreview() {
  return (
    <section className="relative flex min-h-[60vh] w-full flex-col items-center justify-center overflow-hidden bg-white p-4 font-mono antialiased dark:bg-black md:min-h-[25rem] md:p-10">
      {/* Background Grid */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 select-none opacity-[0.08] dark:opacity-15",
          "[background-size:30px_30px]",
          "[mask-image:radial-gradient(ellipse_at_center,black,transparent)]",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)]"
        )}
      />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 md:flex-row md:gap-10">
        
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex max-w-2xl flex-col items-center md:items-start"
        >
          {/* Badge - Style sama seperti tech stack */}
          <div className={`${badgeBaseStyle} mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300`}>
            <span className="relative flex h-2 w-2 mr-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Open to Collaborate
          </div>

          {/* Headline */}
          <h1 className="flex items-center gap-3 text-4xl font-bold leading-tight text-neutral-900 dark:text-white md:text-5xl">
            Hello, I&apos;m Enggi <span className="animate-bounce">👋</span>
          </h1>

          {/* Description */}
          <p className="mt-4 text-justify text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-left">
            My full name is{" "}
            <span className="font-bold text-neutral-900 dark:text-white">
              Muhammad Einggi Gusti P
            </span>
            , a passionate{" "}
            <span className="font-bold italic text-sky-600 dark:text-sky-400">
              Full-Stack Developer
            </span>{" "}
            with a strong foundation in{" "}
            <span className="italic text-neutral-800 dark:text-neutral-200">
              Computer Science
            </span>{" "}
            from Universitas Muhammadiyah Malang. I specialize in building scalable web applications 
            that combine clean code with intuitive user experiences.
          </p>

          <p className="mt-2 text-justify text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-left">
            Currently focused on modern JavaScript ecosystems and Laravel ecosystem, 
            always eager to tackle challenging problems and learn cutting-edge technologies.
          </p>

          {/* Tech Stack - Style sama persis seperti portfolio */}
          <div className="mt-5 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className={`${badgeBaseStyle} ${skill.color}`}
              >
                {skill.name}
              </span>
            ))}
          </div>

          {/* Social Icons + Resume */}
          <div className="mt-6 flex items-center gap-3">
            {socials.map(({ href, icon, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-xl bg-neutral-200 p-3 text-neutral-700 transition-colors hover:bg-sky-500 hover:text-white dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-sky-500 dark:hover:text-white"
              >
                {icon}
              </motion.a>
            ))}
            
            {/* Download CV Button */}
            <motion.a
              href="/Resume.pdf"
              download="Resume.pdf"
              type="application/pdf"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="ml-auto flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-sky-600"
            >
              <Download size={14} />
              Download CV
            </motion.a>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ y: -4 }}
          className="flex-shrink-0"
        >
          <div className="my-10 w-full max-w-[260px] cursor-pointer rounded-[20px] bg-neutral-100 p-4 shadow-xl transition-all duration-500 hover:ring-2 hover:ring-sky-500/50 dark:bg-neutral-900 dark:hover:ring-sky-500/50 md:my-20 md:p-5">
            <div className="mx-1 flex-1">
              <div className="relative mt-1 aspect-[3/4] w-full overflow-hidden rounded-[12px] bg-neutral-200 dark:bg-neutral-800">
                <Image
                  src="/Images/profile.png"
                  alt="Profile picture"
                  fill
                  priority
                  quality={75}
                  sizes="(max-width: 640px) 100vw, 240px"
                  className="object-cover transition-all duration-500 hover:scale-110"
                />
              </div>
            </div>

            {/* Card Footer dengan badge style */}
            <div className="mt-3 flex items-center justify-center gap-3">
              <span className={`${badgeBaseStyle} bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300`}>
                Full-Stack Dev
              </span>
              <span className={`${badgeBaseStyle} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300`}>
                Open to Work
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
