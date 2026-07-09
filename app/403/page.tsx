"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      {/* Glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[350px] rounded-full bg-red-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-md text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
        >
          <ShieldAlert className="size-10" />
        </motion.div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="font-mono text-3xl font-bold tracking-tight">403 — Forbidden</h1>
          <p className="text-sm font-mono text-neutral-400">
            Access denied. You are not authorized to view the requested resource.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-4 pt-4"
        >
          <Link href="/">
            <Button variant="outline" className="font-mono gap-2 border-neutral-800 hover:bg-neutral-900 text-neutral-300">
              <ArrowLeft className="size-4" />
              Return Home
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button className="font-mono bg-red-600 hover:bg-red-500 text-white">
              Log In as Admin
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
