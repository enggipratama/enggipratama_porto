"use client";
import React from "react";
import { Button } from "@/components/ui/stateful-button";

interface StatefulButtonProps {
  status: "idle" | "loading" | "success" | "error";
  children: React.ReactNode;
}

export function StatefulButton({ status, children }: StatefulButtonProps) {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Button state={status} type="submit">
        {children}
      </Button>
    </div>
  );
}
