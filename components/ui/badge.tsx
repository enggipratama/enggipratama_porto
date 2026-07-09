import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "sky" | "purple" | "emerald" | "neutral" | "yellow" | "red" | "blue" | "cyan" | "indigo" | "pink";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  neutral: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  pink: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
};

export function Badge({
  children,
  variant = "default",
  size = "sm",
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center",
        size === "sm" && "rounded-md px-2 py-1 text-[10px] font-medium sm:rounded-full sm:px-2.5 sm:text-xs",
        size === "md" && "rounded-lg px-3 py-1.5 text-xs font-medium sm:rounded-full sm:px-4 sm:text-sm",
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
}
