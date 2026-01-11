"use client";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { motion, useAnimate, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  state?: "idle" | "loading" | "success" | "error";
}

export const Button = ({
  className,
  children,
  state = "idle",
  ...props
}: ButtonProps) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (state === "loading") {
      animate(
        ".loader",
        { width: "20px", scale: 1, display: "block" },
        { duration: 0.2 }
      );
      animate(".check", { width: "0px", scale: 0, display: "none" });
    } else if (state === "success") {
      animate(
        ".loader",
        { width: "0px", scale: 0, display: "none" },
        { duration: 0.2 }
      );
      animate(
        ".check",
        { width: "20px", scale: 1, display: "block" },
        { duration: 0.2 }
      );
    } else {
      animate(
        ".loader",
        { width: "0px", scale: 0, display: "none" },
        { duration: 0.2 }
      );
      animate(
        ".check",
        { width: "0px", scale: 0, display: "none" },
        { duration: 0.2 }
      );
    }
  }, [state, animate]);

  return (
    <motion.button
      layout
      ref={scope}
      disabled={props.disabled || state === "loading" || state === "success"}
      className={cn(
        "flex min-w-[140px] cursor-pointer items-center justify-center gap-2 rounded-full bg-sky-700 px-6 py-3 font-medium text-white transition duration-200 hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-80",
        className
      )}
      {...props}
    >
      <motion.div layout className="flex items-center gap-2">
        <Loader />
        <CheckIcon />
        <motion.span layout>{children}</motion.span>
      </motion.div>
    </motion.button>
  );
};

const Loader = () => (
  <motion.svg
    animate={{ rotate: 360 }}
    initial={{ scale: 0, width: 0, display: "none" }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="loader text-white"
  >
    <path d="M12 3a9 9 0 1 0 9 9" />
  </motion.svg>
);

const CheckIcon = () => (
  <motion.svg
    initial={{ scale: 0, width: 0, display: "none" }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="check text-white"
  >
    <path d="M5 12l5 5L20 7" />
  </motion.svg>
);
