import { createSupabaseServerClient } from "@/lib/supabase-server";

// ============================================================
// Default (fallback) data — used when Supabase is unavailable
// ============================================================

export const DEFAULTS = {
  hero_name: "Enggi Pratama",
  hero_tagline:
    "Transforming complex problems into elegant solutions, one line of code at a time.",
  hero_badge_text: "Available for Opportunities",
  text_flip_words: ["Portfolio", "Blog", "Projects", "Articles"],
  about_fullname: "Muhammad Einggi Gusti P",
  about_nickname: "Enggi",
  about_title: "Full-Stack Developer",
  about_badge_title: "Full-Stack Dev",
  seo_title: "Enggi Pratama | Full-Stack Developer",
  seo_description: "Personal portfolio website of Enggi Pratama, built with Next.js, React, and Supabase.",
  seo_keywords: "Enggi Pratama, portfolio, web developer, full-stack, react, nextjs",
  about_description: [
    "My full name is Muhammad Einggi Gusti P, a passionate Full-Stack Developer with a strong foundation in Computer Science from Universitas Muhammadiyah Malang. I specialize in building scalable web applications that combine clean code with intuitive user experiences.",
    "Currently focused on modern JavaScript ecosystems and Laravel ecosystem, always eager to tackle challenging problems and learn cutting-edge technologies.",
  ],
  about_badge_text: "Open to Collaborate",
  about_profile_image: "/Images/profile.png",
  about_cv_url: "/Resume.pdf",
  skills: [
    { name: "Next.js", variant: "neutral" },
    { name: "React", variant: "sky" },
    { name: "TypeScript", variant: "blue" },
    { name: "Tailwind", variant: "cyan" },
    { name: "Laravel", variant: "red" },
    { name: "PHP", variant: "indigo" },
    { name: "MySQL", variant: "blue" },
    { name: "Framer", variant: "pink" },
  ],
  social_links: [
    {
      label: "Github",
      href: "https://github.com/enggipratama",
      platform: "github",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/enggipratama",
      platform: "linkedin",
    },
    {
      label: "Instagram",
      href: "https://instagram.com/enggiipratama",
      platform: "instagram",
    },
    {
      label: "Email",
      href: "work.enggipratama@gmail.com",
      platform: "email",
    },
  ],
  footer_tagline: "Feel free to reach out. — Say hello anytime!",
  portfolio_section_title: "Selected Works",
  portfolio_section_subtitle: "A curated collection of projects that showcase my growth as a developer",
  contact_location: "Indonesia",
  contact_response_time: "Usually within 24 hours",
  giscus_repo: "enggipratama/enggipratama",
  giscus_repo_id: "R_kgDOL-qXqQ",
  giscus_category_id: "DIC_kwDOL-qXqc4C0tG-",
} as const;

export type SiteSettings = typeof DEFAULTS;

// ============================================================
// Server-side data fetching (with fallback)
// ============================================================

/**
 * Fetch a single site setting by key, with fallback to hardcoded defaults.
 */
export async function getSetting<K extends keyof typeof DEFAULTS>(
  key: K
): Promise<(typeof DEFAULTS)[K]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .single();

    if (error || !data) return DEFAULTS[key];
    return data.value as (typeof DEFAULTS)[K];
  } catch {
    return DEFAULTS[key];
  }
}

/**
 * Fetch multiple site settings at once.
 */
export async function getSettings<K extends keyof typeof DEFAULTS>(
  keys: K[]
): Promise<Pick<typeof DEFAULTS, K>> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", keys);

    if (error || !data) {
      return Object.fromEntries(
        keys.map((k) => [k, DEFAULTS[k]])
      ) as Pick<typeof DEFAULTS, K>;
    }

    const result = {} as Record<string, unknown>;
    for (const key of keys) {
      const found = data.find((d: { key: string }) => d.key === key);
      result[key] = found ? found.value : DEFAULTS[key];
    }
    return result as Pick<typeof DEFAULTS, K>;
  } catch {
    return Object.fromEntries(
      keys.map((k) => [k, DEFAULTS[k]])
    ) as Pick<typeof DEFAULTS, K>;
  }
}

/**
 * Fetch all settings at once.
 */
export async function getAllSettings(): Promise<typeof DEFAULTS> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (error || !data) return { ...DEFAULTS };

    const result = { ...DEFAULTS } as Record<string, unknown>;
    for (const row of data) {
      if (row.key in DEFAULTS) {
        result[row.key] = row.value;
      }
    }
    return result as typeof DEFAULTS;
  } catch {
    return { ...DEFAULTS };
  }
}

// ============================================================
// Project types & fetching
// ============================================================

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  year: string;
  image_url: string;
  demo_url: string;
  github_url: string;
  tech_stack: { name: string; key: string }[];
  sort_order: number;
  is_coming_soon: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Davibar Inventory System",
    subtitle: "Enterprise Warehouse Management Solution",
    description:
      "A robust inventory management system designed for Davibar House. Features comprehensive stock tracking, real-time transaction monitoring, automated reporting dashboards, and multi-user role management.",
    year: "2023",
    image_url: "/Images/davibar.png",
    demo_url: "https://davibar.enggipratama.my.id",
    github_url: "https://github.com/enggipratama/DAVIBARTEST",
    tech_stack: [
      { name: "Laravel", key: "laravel" },
      { name: "PHP", key: "php" },
      { name: "MySQL", key: "mysql" },
      { name: "Bootstrap", key: "bootstrap" },
    ],
    sort_order: 1,
    is_coming_soon: false,
    is_visible: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    title: "Personal Portfolio V1",
    subtitle: "First Iteration of My Digital Presence",
    description:
      "My inaugural portfolio built with modern web technologies. Features fluid animations, seamless dark mode transitions, and a fully responsive layout optimized for all devices.",
    year: "2024",
    image_url: "/Images/old_portfolio.png",
    demo_url: "https://megp.enggipratama.my.id",
    github_url: "https://github.com/enggipratama/porto",
    tech_stack: [
      { name: "Next.js", key: "nextjs" },
      { name: "TypeScript", key: "typescript" },
      { name: "Tailwind", key: "tailwind" },
    ],
    sort_order: 2,
    is_coming_soon: false,
    is_visible: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    title: "Mystery Love",
    subtitle: "Interactive Celebration Experience",
    description:
      "An immersive interactive web experience crafted with meticulous attention to animation detail. Leveraging Framer Motion to create memorable, emotionally resonant digital moments.",
    year: "2025",
    image_url: "/Images/mystery-love.png",
    demo_url: "https://bub.enggipratama.my.id",
    github_url: "https://github.com/enggipratama/mystery-love",
    tech_stack: [
      { name: "Next.js", key: "nextjs" },
      { name: "React", key: "react" },
      { name: "Framer", key: "framer" },
      { name: "Tailwind", key: "tailwind" },
    ],
    sort_order: 3,
    is_coming_soon: false,
    is_visible: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    title: "Next Big Thing",
    subtitle: "Something Extraordinary is Brewing",
    description:
      "Currently architecting an ambitious project that will push the boundaries of my technical capabilities. Stay tuned for a showcase of advanced full-stack implementation and innovative UI/UX design.",
    year: "TBA",
    image_url: "/Images/staytuned.png",
    demo_url: "",
    github_url: "",
    tech_stack: [],
    sort_order: 4,
    is_coming_soon: true,
    is_visible: true,
    created_at: "",
    updated_at: "",
  },
];

/**
 * Fetch all visible projects, ordered by sort_order.
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return DEFAULT_PROJECTS;
    return data as Project[];
  } catch {
    return DEFAULT_PROJECTS;
  }
}

/**
 * Fetch ALL projects (including hidden) — for admin panel.
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return DEFAULT_PROJECTS;
    return data as Project[];
  } catch {
    return DEFAULT_PROJECTS;
  }
}

/**
 * Fetch a single project by ID — for admin edit page.
 */
export async function getProject(id: string): Promise<Project | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data as Project;
  } catch {
    return null;
  }
}
