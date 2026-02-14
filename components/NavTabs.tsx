"use client";

import { Home, List, BarChart2, Gift } from "lucide-react";

type TabId = "home" | "library" | "analysis" | "gift";

interface NavTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "홈", icon: <Home size={24} /> },
  { id: "library", label: "분류", icon: <List size={24} /> },
  { id: "analysis", label: "분석", icon: <BarChart2 size={24} /> },
  { id: "gift", label: "사은품", icon: <Gift size={24} /> },
];

export default function NavTabs({ activeTab, onTabChange }: NavTabsProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-chulbit-card flex justify-around items-center py-2.5 shadow-nav z-[1000]"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 10px)" }}
      aria-label="하단 탭"
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center gap-1 px-3 py-2 flex-1 text-[11px] transition-colors border-none bg-transparent cursor-pointer font-nanum-myeongjo ${
            activeTab === tab.id
              ? "text-point font-bold"
              : "text-text-muted"
          }`}
          aria-current={activeTab === tab.id ? "page" : undefined}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
