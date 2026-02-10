"use client";

import { Settings } from "lucide-react";

interface HeaderProps {
  onOpenSettings: () => void;
}

export default function Header({ onOpenSettings }: HeaderProps) {
  return (
    <header className="relative flex items-center justify-between px-4 sm:px-6 py-4 md:py-5 min-h-[56px] bg-[#FAFAF8] border-b border-[#11593F]/10">
      <h1 className="absolute left-0 right-0 text-center text-[24px] sm:text-[26px] font-extrabold text-[#11593F] pointer-events-none">
        출빛소
      </h1>
      <button
        type="button"
        onClick={onOpenSettings}
        className="relative z-10 p-3 -m-1 rounded-full hover:bg-[#e8f5e9] active:bg-[#e8f5e9] text-[#11593F] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ml-auto"
        aria-label="설정"
      >
        <Settings size={24} strokeWidth={2} />
      </button>
    </header>
  );
}
