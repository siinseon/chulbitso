"use client";

import { Settings } from "lucide-react";

interface HeaderProps {
  onOpenSettings: () => void;
  variant?: "default" | "video";
}

export default function Header({ onOpenSettings, variant = "default" }: HeaderProps) {
  const isVideo = variant === "video";
  return (
    <header className="relative flex items-center justify-between px-4 sm:px-6 py-4 md:py-5 min-h-[56px] bg-vintage-bg border-b border-secondary/30">
      <h1
        className={`absolute left-0 right-0 text-center text-[26px] sm:text-[28px] font-extrabold tracking-tight font-myeongjo pointer-events-none ${isVideo ? "font-mono" : "text-primary drop-shadow-sm"}`}
        style={
          isVideo
            ? {
                color: "#00FF00",
                textShadow: "0 0 8px #00FF00, 0 0 16px rgba(0,255,0,0.6), 0 0 24px rgba(0,255,0,0.4)",
              }
            : undefined
        }
      >
        출빛소
      </h1>
      <button
        type="button"
        onClick={onOpenSettings}
        className="relative z-10 p-3 -m-1 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ml-auto"
        style={{ color: "#3d4a36" }}
        aria-label="설정"
      >
        <Settings size={24} strokeWidth={2} />
      </button>
    </header>
  );
}
