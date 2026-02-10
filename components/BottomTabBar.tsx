"use client";

import { Search, Library } from "lucide-react";

type Tab = "search" | "library";

interface BottomTabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  return (
    <nav className="nav-bar" aria-label="하단 탭">
      <button
        type="button"
        className={`nav-item ${activeTab === "search" ? "active" : ""}`}
        onClick={() => onTabChange("search")}
        aria-current={activeTab === "search" ? "page" : undefined}
      >
        <Search size={24} />
        <span>검색</span>
      </button>
      <button
        type="button"
        className={`nav-item ${activeTab === "library" ? "active" : ""}`}
        onClick={() => onTabChange("library")}
        aria-current={activeTab === "library" ? "page" : undefined}
      >
        <Library size={24} />
        <span>내 서재</span>
      </button>
    </nav>
  );
}
