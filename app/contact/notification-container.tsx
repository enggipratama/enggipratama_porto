"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Info, X, ChevronRight } from "lucide-react";

type NotificationAction = {
  label: string;
  onClick: () => void;
};

type Notification = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  action?: NotificationAction;
  undo?: () => void;
};

const notificationConfig = {
  success: {
    icon: CheckCircle,
    border: "border-l-emerald-500 dark:border-l-emerald-400",
    iconColor: "text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]",
    progress: "bg-emerald-500 dark:bg-emerald-400",
  },
  error: {
    icon: XCircle,
    border: "border-l-red-500 dark:border-l-red-400",
    iconColor: "text-red-500 dark:text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]",
    progress: "bg-red-500 dark:bg-red-400",
  },
  info: {
    icon: Info,
    border: "border-l-sky-500 dark:border-l-sky-400",
    iconColor: "text-sky-500 dark:text-sky-400 drop-shadow-[0_0_8px_rgba(14,165,233,0.3)]",
    progress: "bg-sky-500 dark:bg-sky-400",
  },
};

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationContainer({ 
  notifications, 
  onRemove, 
  onClearAll 
}: NotificationContainerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    const viewport = typeof window !== "undefined" ? window.visualViewport : null;
    
    const updatePosition = () => {
      if (viewport && window.innerWidth < 768 && containerRef.current) {
        const offset = viewport.offsetTop;
        const pageScroll = window.scrollY !== undefined ? window.scrollY : window.pageYOffset;
        
        // Detect if keyboard is open (visual viewport height is smaller than innerHeight)
        const isKeyboardOpen = (window.innerHeight - viewport.height) > 100;
        const hasScrolled = pageScroll > 10 || offset > 10;
        
        if (hasScrolled || isKeyboardOpen) {
          // Bottom state: Position just above the keyboard / at the bottom of the visual viewport
          const containerHeight = containerRef.current.offsetHeight || 0;
          const targetTop = offset + viewport.height - containerHeight - 16;
          // Calculate translate relative to CSS top-24 (which is 96px)
          const translateY = targetTop - 96;
          
          containerRef.current.style.transform = `translateY(${translateY}px) translateZ(0)`;
          containerRef.current.style.webkitTransform = `translateY(${translateY}px) translateZ(0)`;
        } else {
          // Top state: Position at the top (top-24)
          containerRef.current.style.transform = `translateY(${offset}px) translateZ(0)`;
          containerRef.current.style.webkitTransform = `translateY(${offset}px) translateZ(0)`;
        }
      } else if (containerRef.current) {
        containerRef.current.style.transform = "";
        containerRef.current.style.webkitTransform = "";
      }
    };
    
    if (viewport) {
      viewport.addEventListener("resize", updatePosition);
      viewport.addEventListener("scroll", updatePosition);
      updatePosition();
    }
    
    // Listen to standard scroll event to trigger transition as soon as user starts scrolling
    window.addEventListener("scroll", updatePosition);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", updatePosition);
      if (viewport) {
        viewport.removeEventListener("resize", updatePosition);
        viewport.removeEventListener("scroll", updatePosition);
      }
    };
  }, [notifications]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed z-[9999] flex flex-col gap-3 pointer-events-none",
        "top-24 left-4 right-4",
        "md:top-auto md:bottom-6 md:left-auto md:right-6 md:w-80 lg:w-96"
      )}
      style={{
        contain: 'layout style paint',
      }}
    >
      <AnimatePresence>
        {notifications.length > 2 && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{
              type: "tween",
              ease: [0.16, 1, 0.3, 1],
              duration: 0.4
            }}
            onClick={onClearAll}
            className="pointer-events-auto self-end flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 dark:bg-white/90 text-white dark:text-neutral-900 text-xs font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <span>+{notifications.length - 2} more</span>
            <X size={12} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {notifications.slice(0, 2).map((notif) => {
          const config = notificationConfig[notif.type];
          const IconComponent = config.icon;
          return (
            <motion.div
              key={notif.id}
              layout
              drag="x"
              dragConstraints={{ left: 0, right: 100 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x > 80) {
                  onRemove(notif.id);
                }
              }}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{
                type: "tween",
                ease: [0.16, 1, 0.3, 1],
                duration: 0.4
              }}
              className={cn(
                "pointer-events-auto relative overflow-hidden rounded-2xl shadow-xl shadow-neutral-200/20 dark:shadow-black/40 cursor-grab active:cursor-grabbing",
                "backdrop-blur-md bg-white/80 dark:bg-white/[0.02]",
                "border border-neutral-300/40 dark:border-white/[0.08]",
                "border-l-[3px]",
                config.border
              )}
              style={{
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
              }}
            >
              {isMobile && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-300 dark:text-neutral-600">
                  <ChevronRight size={16} />
                </div>
              )}

              <div className="flex items-start gap-3 p-4 pr-8 md:pr-4">
                <div className={cn("shrink-0 mt-0.5", config.iconColor)}>
                  <IconComponent size={20} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 leading-relaxed">
                    {notif.message}
                  </p>
                  
                  {notif.action && (
                    <button
                      onClick={() => {
                        notif.action?.onClick();
                        onRemove(notif.id);
                      }}
                      className="mt-2 text-xs font-bold px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                    >
                      {notif.action.label}
                    </button>
                  )}

                  {notif.undo && (
                    <button
                      onClick={() => {
                        notif.undo?.();
                        onRemove(notif.id);
                      }}
                      className={cn(
                        "mt-2 text-xs font-bold px-3 py-1 rounded-full transition-colors",
                        "bg-white dark:bg-neutral-900 border border-current",
                        config.iconColor
                      )}
                    >
                      Undo
                    </button>
                  )}
                </div>
                <button
                  onClick={() => onRemove(notif.id)}
                  className="shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors p-0.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <X size={16} />
                </button>
              </div>
              
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ 
                  duration: (notif.duration || 4000) / 1000, 
                  ease: "linear" 
                }}
                style={{ originX: 0 }}
                className={cn("h-0.5", config.progress)}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
