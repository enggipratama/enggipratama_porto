"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Lock, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function getDeviceInfo(): string {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  let browser = "Unknown";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\//.test(ua)) browser = "Opera";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Safari\//.test(ua)) browser = "Safari";

  let os = "Unknown";
  if (/Android/.test(ua)) {
    const androidMatch = ua.match(/Android\s+[0-9.]+;\s*([^;)]+)/);
    if (androidMatch) {
      os = androidMatch[1].trim().split(" Build/")[0];
    } else {
      os = "Android";
    }
  } else if (/iPhone/.test(ua)) {
    os = "iPhone";
  } else if (/iPad/.test(ua)) {
    os = "iPad";
  } else if (/Windows NT/.test(ua)) {
    os = "Windows";
  } else if (/Mac OS X|Macintosh/.test(ua)) {
    os = "macOS";
  } else if (/Linux/.test(ua)) {
    os = "Linux";
  }

  return `${browser} · ${os}`;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const supabase = createSupabaseBrowserClient();
  
  useEffect(() => {
    // Force body background to match neutral-950 to prevent white bar glitches on mobile status/address bars
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#0a0a0a";
    
    // Ensure HTML element has dark class for dark mode background consistency
    const html = document.documentElement;
    const hadDark = html.classList.contains("dark");
    if (!hadDark) {
      html.classList.add("dark");
    }

    return () => {
      document.body.style.backgroundColor = originalBg;
      if (!hadDark) {
        html.classList.remove("dark");
      }
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setLoading(true);
    try {
      // 1. Perform authentication
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials");
        return;
      }

      // 2. Generate a unique session token
      const newToken = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem("admin_session_token", newToken);

      // 4. Update session token in Supabase
      const { error: upsertError } = await supabase
        .from("site_settings")
        .upsert(
          { key: "active_admin_session", value: { token: newToken, last_active_at: new Date().toISOString() } },
          { onConflict: "key" }
        );

      if (upsertError) {
        await supabase.auth.signOut();
        localStorage.removeItem("admin_session_token");
        toast.error("Failed to establish session. Please try again.");
        return;
      }

      toast.success("Logged in successfully!");
      void fetch("/api/admin/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", entity: values.email, details: { device: getDeviceInfo() } }),
      }).catch(() => {});
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dark flex min-h-screen items-center justify-center bg-neutral-950 px-4 relative overflow-hidden font-mono">
      {/* Dynamic Background ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[15%] left-[5%] size-[280px] sm:size-[400px] rounded-full bg-sky-500/5 blur-[120px] animate-pulse" style={{ animationDuration: "12s" }} />
        <div className="absolute bottom-[15%] right-[5%] size-[280px] sm:size-[400px] rounded-full bg-purple-500/5 blur-[120px] animate-pulse" style={{ animationDuration: "8s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Logo/Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative mb-3 flex size-12 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-lg">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-500 to-purple-500 opacity-20 blur-sm" />
            <Lock className="size-5 text-sky-400 relative z-10" />
          </div>
          <h2 className="font-mono text-xl font-bold tracking-widest text-white uppercase">MEGP Admin</h2>
          <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono mt-1">Authorized Access Only</p>
        </div>

        <Card className="border border-neutral-800/80 bg-neutral-900/25 backdrop-blur-lg shadow-2xl rounded-2xl relative overflow-hidden p-1 sm:p-3">
          {/* Inner Card Subtle Glows */}
          <div className="pointer-events-none absolute -top-10 -right-10 size-24 rounded-full bg-sky-500/5 blur-[25px]" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 size-24 rounded-full bg-purple-500/5 blur-[25px]" />

          <CardHeader className="space-y-1.5 text-center pb-5">
            <CardTitle className="font-mono text-lg font-bold tracking-tight text-white">
              Sign In
            </CardTitle>
            <CardDescription className="text-neutral-400 text-xs font-mono">
              Provide credentials to access command dashboard.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-350 font-mono text-xs">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 w-full bg-neutral-950/80 border border-neutral-850 focus-visible:ring-sky-500/20 text-white font-mono text-sm h-11 rounded-xl transition-all duration-300"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 font-mono mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-350 font-mono text-xs">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 w-full bg-neutral-950/80 border border-neutral-850 focus-visible:ring-sky-500/20 text-white font-mono text-sm h-11 rounded-xl transition-all duration-300"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-550 hover:text-neutral-350 transition-colors focus:outline-none p-1 rounded-md"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 font-mono mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 via-sky-600 to-purple-600 hover:from-sky-400 hover:to-purple-550 text-white font-mono mt-6 h-11 text-xs font-bold rounded-xl transition-all duration-300 shadow-md shadow-sky-500/10 border-0 hover:shadow-sky-500/20 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Login to Dashboard"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back navigation link */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 font-mono transition-colors">
            <ArrowLeft className="size-3.5" />
            Back to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
