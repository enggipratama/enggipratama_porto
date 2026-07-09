import { z } from "zod";

const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is missing"),
  CONTACT_RECEIVER_EMAIL: z.string().email("CONTACT_RECEIVER_EMAIL must be a valid email"),
  GITHUB_ACCESS_TOKEN: z.string().min(1, "GITHUB_ACCESS_TOKEN is missing"),
  GITHUB_USERNAME: z.string().min(1, "GITHUB_USERNAME is missing"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing"),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL must be a valid email").optional().default("work.enggipratama@gmail.com"),
});

const isServer = typeof window === "undefined";

const envData = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_RECEIVER_EMAIL: process.env.CONTACT_RECEIVER_EMAIL,
  GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
  GITHUB_USERNAME: process.env.GITHUB_USERNAME,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
};

let env: z.infer<typeof envSchema>;

if (isServer) {
  const parsed = envSchema.safeParse(envData);
  if (!parsed.success) {
    // Print a prominent red warning in console instead of throwing to avoid breaking build stages
    console.error(
      "\x1b[31m%s\x1b[0m",
      "❌ CRITICAL ENVIRONMENT CONFIGURATION ERROR:",
      JSON.stringify(parsed.error.format(), null, 2)
    );
    env = envData as any; // Fallback to raw process.env values if validation fails
  } else {
    env = parsed.data;
  }
} else {
  // Client side validation only for public vars
  const clientSchema = envSchema.pick({
    NEXT_PUBLIC_SUPABASE_URL: true,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: true,
  });
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  if (!parsed.success) {
    console.error(
      "\x1b[33m%s\x1b[0m",
      "⚠️ Public environment variable validation failed:",
      JSON.stringify(parsed.error.format(), null, 2)
    );
  }
  env = envData as any;
}

export { env };
