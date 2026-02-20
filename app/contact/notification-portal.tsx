"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NotificationContainer } from "./notification-container";

export type NotificationAction = {
  label: string;
  onClick: () => void;
};

export type Notification = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  action?: NotificationAction;
  undo?: () => void;
};

interface NotificationPortalProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationPortal({ 
  notifications, 
  onRemove, 
  onClearAll 
}: NotificationPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <NotificationContainer 
      notifications={notifications}
      onRemove={onRemove}
      onClearAll={onClearAll}
    />,
    document.body
  );
}
