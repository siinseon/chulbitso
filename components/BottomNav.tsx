"use client";

import { Tent, Box, Compass, Gem, Plus } from "lucide-react";

export type NavTab = "home" | "category" | "analysis" | "gift";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onFabClick: () => void;
}

export default function BottomNav({ activeTab, onTabChange, onFabClick }: BottomNavProps) {
  const tabs: { id: NavTab; label: string; icon: typeof Tent }[] = [
    { id: "home", label: "놀이터", icon: Tent },
    { id: "category", label: "창고", icon: Box },
    { id: "analysis", label: "탐험", icon: Compass },
    { id: "gift", label: "보물찾기", icon: Gem },
  ];

  const tabButtonClass = (id: NavTab) =>
    `flex flex-col items-center justify-center gap-0.5 py-2.5 px-1.5 flex-1 min-h-[44px] text-[11px] sm:text-[12px] font-jua transition-all duration-200 active:opacity-80 ${
      activeTab === id ? "text-primary font-bold" : "text-secondary/80"
    }`;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 mx-auto max-w-[480px] bg-[#F2E6D0] border-t border-secondary/40 flex justify-around items-center py-2.5 pb-[max(12px,env(safe-area-inset-bottom))] px-2 shadow-nav z-[1000]"
      aria-label="하단 탭"
    >
      {tabs.slice(0, 2).map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTabChange(id)}
          className={tabButtonClass(id)}
          aria-current={activeTab === id ? "page" : undefined}
        >
          <Icon
            size={activeTab === id ? 26 : 22}
            strokeWidth={activeTab === id ? 2.5 : 2}
            className="flex-shrink-0 transition-transform duration-200"
          />
          <span>{label}</span>
        </button>
      ))}

      <button
        type="button"
        onClick={onFabClick}
        className="relative -mt-6 w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-primary flex items-center justify-center shadow-card-lg border-4 border-[#F2E6D0] hover:opacity-90 active:scale-95 transition-all"
        aria-label="도서 추가"
      >
        <Plus size={28} strokeWidth={3} className="text-white" />
      </button>

      {tabs.slice(2).map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTabChange(id)}
          className={tabButtonClass(id)}
          aria-current={activeTab === id ? "page" : undefined}
        >
          <Icon
            size={activeTab === id ? 26 : 22}
            strokeWidth={activeTab === id ? 2.5 : 2}
            className="flex-shrink-0 transition-transform duration-200"
          />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
