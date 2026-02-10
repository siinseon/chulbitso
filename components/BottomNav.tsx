"use client";

import { Home, LayoutGrid, Plus, BarChart3, Gift } from "lucide-react";

export type NavTab = "home" | "category" | "analysis" | "gift";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onFabClick: () => void;
}

export default function BottomNav({ activeTab, onTabChange, onFabClick }: BottomNavProps) {
  const tabs: { id: NavTab; label: string; icon: typeof Home }[] = [
    { id: "home", label: "홈", icon: Home },
    { id: "category", label: "분류", icon: LayoutGrid },
    { id: "analysis", label: "분석", icon: BarChart3 },
    { id: "gift", label: "사은품", icon: Gift },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 mx-auto max-w-[480px] bg-[#FFFFFF] flex justify-around items-center py-3 pb-[max(12px,env(safe-area-inset-bottom))] px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-[1000]"
      aria-label="하단 탭"
    >
      {tabs.slice(0, 2).map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTabChange(id)}
          className={`flex flex-col items-center gap-1 py-2 px-3 flex-1 text-[11px] transition-colors ${
            activeTab === id ? "text-[#11593F] font-bold" : "text-[#999]"
          }`}
          aria-current={activeTab === id ? "page" : undefined}
        >
          <Icon size={24} strokeWidth={activeTab === id ? 2.5 : 2} />
          <span>{label}</span>
        </button>
      ))}

      <button
        type="button"
        onClick={onFabClick}
        className="relative -mt-6 w-14 h-14 rounded-full bg-[#11593F] flex items-center justify-center shadow-[0_4px_12px_rgba(17,89,63,0.3)] border-4 border-white hover:bg-[#0d4630] transition-colors"
        aria-label="도서 추가"
      >
        <Plus size={28} strokeWidth={3} className="text-white" />
      </button>

      {tabs.slice(2).map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTabChange(id)}
          className={`flex flex-col items-center gap-1 py-2 px-3 flex-1 text-[11px] transition-colors ${
            activeTab === id ? "text-[#11593F] font-bold" : "text-[#999]"
          }`}
          aria-current={activeTab === id ? "page" : undefined}
        >
          <Icon size={24} strokeWidth={activeTab === id ? 2.5 : 2} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
