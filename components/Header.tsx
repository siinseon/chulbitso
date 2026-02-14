"use client";

import { Settings } from "lucide-react";

interface HeaderProps {
  onOpenSettings: () => void;
}

export default function Header({ onOpenSettings }: HeaderProps) {
  return (
    <header className="relative flex items-center justify-between px-4 sm:px-6 py-4 md:py-5 min-h-[60px] border-b-2 border-primary/20 bg-library-card/90">
      {/* 빈티지 간판: 입구 느낌 테두리 + 그림자 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center py-1 px-6 rounded-b-md border-x-2 border-b-2 border-primary/30 bg-ivory/95 shadow-md"
        style={{
          boxShadow: "0 4px 12px rgba(58, 49, 40, 0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
        <h1 className="text-[26px] sm:text-[28px] font-extrabold text-primary tracking-tight font-serif drop-shadow-sm">
          출빛소
        </h1>
      </div>
      <button
        type="button"
        onClick={onOpenSettings}
        className="relative z-10 p-3 -m-1 rounded-full hover:bg-primary/10 active:bg-primary/15 text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ml-auto"
        aria-label="설정"
      >
        <Settings size={24} strokeWidth={2} />
      </button>
    </header>
  );
}
