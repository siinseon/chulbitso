"use client";

<<<<<<< HEAD
import { Home, LayoutGrid, Plus, BarChart3, Gift, Compass } from "lucide-react";
=======
import { Tent, Box, Compass, Gem, Plus } from "lucide-react";
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1

export type NavTab = "home" | "category" | "exploration" | "analysis" | "gift";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onFabClick: () => void;
}

export default function BottomNav({ activeTab, onTabChange, onFabClick }: BottomNavProps) {
<<<<<<< HEAD
  const tabs: { id: NavTab; label: string; icon: typeof Home }[] = [
    { id: "home", label: "홈", icon: Home },
    { id: "category", label: "분류", icon: LayoutGrid },
    { id: "exploration", label: "탐험", icon: Compass },
    { id: "analysis", label: "분석", icon: BarChart3 },
    { id: "gift", label: "사은품", icon: Gift },
=======
  const tabs: { id: NavTab; label: string; icon: typeof Tent }[] = [
    { id: "home", label: "놀이터", icon: Tent },
    { id: "category", label: "창고", icon: Box },
    { id: "analysis", label: "탐험", icon: Compass },
    { id: "gift", label: "보물찾기", icon: Gem },
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
  ];

  const tabButtonClass = (id: NavTab) =>
    `flex flex-col items-center justify-center gap-0.5 py-2.5 px-1.5 flex-1 min-h-[44px] text-[11px] sm:text-[12px] font-jua transition-all duration-200 active:opacity-80 ${
      activeTab === id ? "text-primary font-bold" : "text-secondary/80"
    }`;

  return (
    <nav
<<<<<<< HEAD
      className="fixed bottom-0 left-0 right-0 mx-auto max-w-[480px] bg-chulbit-card flex justify-around items-center py-3 pb-[max(12px,env(safe-area-inset-bottom))] px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-[1000]"
=======
      className="fixed bottom-0 left-0 right-0 mx-auto max-w-[480px] bg-vintage-bg border-t border-secondary/40 flex justify-around items-center py-2.5 pb-[max(12px,env(safe-area-inset-bottom))] px-2 shadow-nav z-[1000]"
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
      aria-label="하단 탭"
    >
      {tabs.slice(0, 2).map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTabChange(id)}
<<<<<<< HEAD
          className={`flex flex-col items-center justify-center gap-1 py-3 px-2 flex-1 min-h-[48px] text-[12px] sm:text-[13px] transition-colors active:opacity-80 ${
            activeTab === id ? "text-primary font-bold" : "text-muted"
          }`}
=======
          className={tabButtonClass(id)}
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
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
<<<<<<< HEAD
        className="relative -mt-6 w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-primary flex items-center justify-center shadow-[0_4px_12px_rgba(74,94,66,0.3)] border-4 border-chulbit-card hover:bg-primary-dark active:scale-95 transition-transform"
=======
        className="relative -mt-6 w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-primary flex items-center justify-center shadow-card-lg border-4 border-vintage-bg hover:opacity-90 active:scale-95 transition-all"
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
        aria-label="도서 추가"
      >
        <Plus size={28} strokeWidth={3} className="text-white" />
      </button>

      {tabs.slice(2).map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTabChange(id)}
<<<<<<< HEAD
          className={`flex flex-col items-center justify-center gap-1 py-3 px-2 flex-1 min-h-[48px] text-[12px] sm:text-[13px] transition-colors active:opacity-80 ${
            activeTab === id ? "text-primary font-bold" : "text-muted"
          }`}
=======
          className={tabButtonClass(id)}
>>>>>>> 01f716a799330e89d4c3ea3e94713e7f97297ac1
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
