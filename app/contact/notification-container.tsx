"use client";

import { useEffect, useState } from "react";
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
    border: "border-l-emerald-500",
    iconColor: "text-emerald-500",
    progress: "bg-emerald-500",
  },
  error: {
    icon: XCircle,
    border: "border-l-red-500",
    iconColor: "text-red-500",
    progress: "bg-red-500",
  },
  info: {
    icon: Info,
    border: "border-l-sky-500",
    iconColor: "text-sky-500",
    progress: "bg-sky-500",
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div 
      className={cn(
        "fixed z-[9999] flex flex-col gap-3 pointer-events-none",
        "top-24 left-4 right-4",
        "md:left-auto md:right-6 md:bottom-6 md:top-auto md:w-80 lg:w-96"
      )}
      style={{
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        contain: 'layout style paint',
      }}
    >
      <AnimatePresence>
        {notifications.length > 3 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={onClearAll}
            className="pointer-events-auto self-end flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 dark:bg-white/90 text-white dark:text-neutral-900 text-xs font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <span>+{notifications.length - 3} more</span>
            <X size={12} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {notifications.slice(0, 3).map((notif) => {
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
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "pointer-events-auto relative overflow-hidden rounded-xl shadow-2xl cursor-grab active:cursor-grabbing",
                "backdrop-blur-xl bg-white/95 dark:bg-neutral-900/95",
                "border border-neutral-200/50 dark:border-neutral-700/50",
                "border-l-4",
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
