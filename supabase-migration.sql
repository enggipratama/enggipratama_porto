-- =============================================
-- MEGP Portfolio Admin Panel — Supabase Setup
-- Run this SQL in your Supabase SQL Editor
-- =============================================

-- 1. Site Settings Table
-- Stores key-value pairs for all site content
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings
CREATE POLICY "Public can read site_settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update site_settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert site_settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  subtitle text DEFAULT '',
  description text DEFAULT '',
  year text NOT NULL DEFAULT '2025',
  image_url text DEFAULT '',
  demo_url text DEFAULT '',
  github_url text DEFAULT '',
  tech_stack jsonb DEFAULT '[]',
  sort_order int DEFAULT 0,
  is_coming_soon boolean DEFAULT false,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public can read visible projects
CREATE POLICY "Public can read visible projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

-- Authenticated can read all projects (including hidden)
CREATE POLICY "Authenticated can read all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true);

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- 3. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 4. Seed initial site settings data
INSERT INTO site_settings (key, value) VALUES
  ('hero_name', '"Enggi Pratama"'),
  ('hero_tagline', '"Transforming complex problems into elegant solutions, one line of code at a time."'),
  ('hero_badge_text', '"Available for Opportunities"'),
  ('text_flip_words', '["Portfolio", "Blog", "Projects", "Articles"]'),
  ('about_fullname', '"Muhammad Einggi Gusti P"'),
  ('about_nickname', '"Enggi"'),
  ('about_title', '"Full-Stack Developer"'),
  ('about_badge_title', '"Full-Stack Dev"'),
  ('seo_title', '"Enggi Pratama | Full-Stack Developer"'),
  ('seo_description', '"Personal portfolio website of Enggi Pratama, built with Next.js, React, and Supabase."'),
  ('seo_keywords', '"Enggi Pratama, portfolio, web developer, full-stack, react, nextjs"'),
  ('about_description', '["My full name is Muhammad Einggi Gusti P, a passionate Full-Stack Developer with a strong foundation in Computer Science from Universitas Muhammadiyah Malang. I specialize in building scalable web applications that combine clean code with intuitive user experiences.", "Currently focused on modern JavaScript ecosystems and Laravel ecosystem, always eager to tackle challenging problems and learn cutting-edge technologies."]'),
  ('about_badge_text', '"Open to Collaborate"'),
  ('about_profile_image', '"/Images/profile.png"'),
  ('about_cv_url', '"/Resume.pdf"'),
  ('skills', '[{"name":"Next.js","variant":"neutral"},{"name":"React","variant":"sky"},{"name":"TypeScript","variant":"blue"},{"name":"Tailwind","variant":"cyan"},{"name":"Laravel","variant":"red"},{"name":"PHP","variant":"indigo"},{"name":"MySQL","variant":"blue"},{"name":"Framer","variant":"pink"}]'),
  ('social_links', '[{"label":"Github","href":"https://github.com/enggipratama","platform":"github"},{"label":"LinkedIn","href":"https://linkedin.com/in/enggipratama","platform":"linkedin"},{"label":"Instagram","href":"https://instagram.com/enggiipratama","platform":"instagram"},{"label":"Email","href":"work.enggipratama@gmail.com","platform":"email"}]'),
  ('footer_tagline', '"Feel free to reach out. — Say hello anytime!"')
ON CONFLICT (key) DO NOTHING;

-- 5. Seed initial projects data
INSERT INTO projects (title, subtitle, description, year, image_url, demo_url, github_url, tech_stack, sort_order, is_coming_soon) VALUES
  (
    'Davibar Inventory System',
    'Enterprise Warehouse Management Solution',
    'A robust inventory management system designed for Davibar House. Features comprehensive stock tracking, real-time transaction monitoring, automated reporting dashboards, and multi-user role management.',
    '2023',
    '/Images/davibar.png',
    'https://davibar.enggipratama.my.id',
    'https://github.com/enggipratama/DAVIBARTEST',
    '[{"name":"Laravel","key":"laravel"},{"name":"PHP","key":"php"},{"name":"MySQL","key":"mysql"},{"name":"Bootstrap","key":"bootstrap"}]',
    1,
    false
  ),
  (
    'Personal Portfolio V1',
    'First Iteration of My Digital Presence',
    'My inaugural portfolio built with modern web technologies. Features fluid animations, seamless dark mode transitions, and a fully responsive layout optimized for all devices.',
    '2024',
    '/Images/old_portfolio.png',
    'https://megp.enggipratama.my.id',
    'https://github.com/enggipratama/porto',
    '[{"name":"Next.js","key":"nextjs"},{"name":"TypeScript","key":"typescript"},{"name":"Tailwind","key":"tailwind"}]',
    2,
    false
  ),
  (
    'Mystery Love',
    'Interactive Celebration Experience',
    'An immersive interactive web experience crafted with meticulous attention to animation detail. Leveraging Framer Motion to create memorable, emotionally resonant digital moments.',
    '2025',
    '/Images/mystery-love.png',
    'https://bub.enggipratama.my.id',
    'https://github.com/enggipratama/mystery-love',
    '[{"name":"Next.js","key":"nextjs"},{"name":"React","key":"react"},{"name":"Framer","key":"framer"},{"name":"Tailwind","key":"tailwind"}]',
    3,
    false
  ),
  (
    'Next Big Thing',
    'Something Extraordinary is Brewing',
    'Currently architecting an ambitious project that will push the boundaries of my technical capabilities. Stay tuned for a showcase of advanced full-stack implementation and innovative UI/UX design.',
    'TBA',
    '/Images/staytuned.png',
    '',
    '',
    '[]',
    4,
    true
  )
ON CONFLICT DO NOTHING;

-- 6. Create storage bucket for uploads (run separately in Supabase Dashboard > Storage)
-- CREATE BUCKET: 'portfolio-images' with public access
