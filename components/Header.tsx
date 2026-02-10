"use client";

import { Settings } from "lucide-react";

interface HeaderProps {
  onOpenSettings: () => void;
}

export default function Header({ onOpenSettings }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-4 md:py-5">
      <h1 className="text-[20px] md:text-[22px] font-bold text-[#11593F]">
        출빛소
      </h1>
      <button
        type="button"
        onClick={onOpenSettings}
        className="p-2 rounded-full hover:bg-[#e8f5e9] text-[#11593F] transition-colors"
        aria-label="설정"
      >
        <Settings size={24} strokeWidth={2} />
      </button>
    </header>
  );
}
