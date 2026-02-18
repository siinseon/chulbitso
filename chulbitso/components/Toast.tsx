"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
  className?: string;
}

export default function Toast({
  message,
  visible,
  onClose,
  duration = 2500,
  className,
}: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      className={cn(
        "fixed bottom-24 left-1/2 -translate-x-1/2 z-[1100] px-6 py-4 rounded-xl bg-accent-warm text-white font-medium shadow-lg",
        className
      )}
    >
      {message}
    </div>
  );
}
