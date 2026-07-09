"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Mail, Download } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const socials = [
  {
    label: "Github",
    href: "https://github.com/enggipratama",
    icon: <Github size={18} />,
    color: "hover:text-neutral-900 dark:hover:text-white",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/enggipratama",
    icon: <Linkedin size={18} />,
    color: "hover:text-blue-600 dark:hover:text-blue-400",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/enggiipratama",
    icon: <Instagram size={18} />,
    color: "hover:text-pink-600 dark:hover:text-pink-400",
  },
  {
    label: "Email",
    href: "mailto:work.enggipratama@gmail.com",
    icon: <Mail size={18} />,
    color: "hover:text-sky-500 dark:hover:text-sky-400",
  },
];

const skills = [
  { name: "Next.js", variant: "neutral" as const },
  { name: "React", variant: "sky" as const },
  { name: "TypeScript", variant: "blue" as const },
  { name: "Tailwind", variant: "cyan" as const },
  { name: "Laravel", variant: "red" as const },
  { name: "PHP", variant: "indigo" as const },
  { name: "MySQL", variant: "blue" as const },
  { name: "Framer", variant: "pink" as const },
];

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
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 1.0 }}
          className="flex max-w-2xl flex-col items-center md:items-start"
        >
          {/* Badge - Style sama seperti tech stack */}
          <div className="mb-4">
            <Badge variant="success" icon={
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            }>
              Open to Collaborate
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="flex items-center gap-3 text-4xl font-bold leading-tight text-neutral-900 dark:text-white md:text-5xl">
            Hello, I&apos;m Enggi <span className="animate-bounce">👋</span>
          </h1>

          {/* Description */}
          <p className="mt-4 text-justify text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 md:text-left">
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

          <p className="mt-2 text-justify text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 md:text-left">
            Currently focused on modern JavaScript ecosystems and Laravel ecosystem, 
            always eager to tackle challenging problems and learn cutting-edge technologies.
          </p>

          {/* Tech Stack - Staggered reveal animation */}
          <motion.div 
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.05,
                }
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            className="mt-5 flex flex-wrap gap-2 justify-center md:justify-start"
          >
            {skills.map((skill) => (
              <motion.div
                key={skill.name}
                variants={{
                  hidden: { opacity: 0, scale: 0.85, y: 10 },
                  visible: { 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    transition: {
                      type: "tween",
                      ease: [0.16, 1, 0.3, 1],
                      duration: 0.5
                    }
                  }
                }}
              >
                <Badge variant={skill.variant}>
                  {skill.name}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Icons + Resume */}
          <div className="mt-6 flex items-center gap-3">
             {socials.map(({ href, icon, label, color }) => (
               <motion.a
                 key={label}
                 href={href}
                 target="_blank"
                 rel="noopener noreferrer"
                 aria-label={label}
                 whileHover={{ y: -5, scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 className={cn(
                   "rounded-xl bg-neutral-200 p-3 text-neutral-700 transition-all dark:bg-neutral-800 dark:text-neutral-300 hover:bg-neutral-300/50 dark:hover:bg-neutral-700/50",
                   color
                 )}
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
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 1.0, delay: 0.15 }}
          whileHover={{ y: -4 }}
          className="flex-shrink-0"
        >
          <div className="my-10 w-full max-w-[280px] cursor-pointer rounded-[20px] border border-neutral-300/50 bg-neutral-50/80 p-4 shadow-xl shadow-neutral-200/40 backdrop-blur-md transition-all duration-500 hover:ring-2 hover:ring-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/10 dark:border-white/[0.08] dark:bg-neutral-800/80 dark:shadow-2xl dark:shadow-black/50 dark:hover:ring-sky-500/50 dark:hover:shadow-sky-500/10 md:my-20 md:p-5">
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
              <Badge variant="sky">Full-Stack Dev</Badge>
              <Badge variant="success">Open to Work</Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
