"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Lock, Mail } from "lucide-react";

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

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials");
        return;
      }

      // Check admin email authorization on client side as well
      const adminEmail = process.env.ADMIN_EMAIL || "work.enggipratama@gmail.com";
      if (data.user?.email !== adminEmail) {
        // Sign out if not the admin email
        await supabase.auth.signOut();
        toast.error("You are not authorized to access this panel.");
        return;
      }

      toast.success("Logged in successfully!");
      
      // Force reload page to ensure middleware redirects cleanly to dashboard
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] size-[300px] rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] size-[300px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-neutral-800 bg-neutral-900/50 backdrop-blur-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="font-mono text-2xl font-bold tracking-tight text-white">
              Admin Login
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Enter your credentials to access the portfolio dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-300 font-mono text-xs">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 size-4 text-neutral-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 bg-neutral-950 border-neutral-800 focus:border-sky-500 focus:ring-sky-500/20 text-white font-mono text-sm"
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
                <Label htmlFor="password" className="text-neutral-300 font-mono text-xs">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 size-4 text-neutral-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-neutral-950 border-neutral-800 focus:border-sky-500 focus:ring-sky-500/20 text-white font-mono text-sm"
                    {...register("password")}
                  />
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
                className="w-full bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-400 hover:to-purple-400 text-white font-mono mt-6"
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
      </motion.div>
    </div>
  );
}
