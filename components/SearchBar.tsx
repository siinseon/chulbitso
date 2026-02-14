"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SearchBar({
  onSearch,
  placeholder = "책 제목, 저자, ISBN으로 검색해보세요",
  disabled = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <Search size={20} stroke="var(--primary)" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="책 검색"
      />
      <button
        type="submit"
        disabled={disabled}
        style={{
          padding: "10px 20px",
          background: "var(--accent-warm)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontFamily: "inherit",
          fontWeight: 700,
          fontSize: "14px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        검색
      </button>
    </form>
  );
}
