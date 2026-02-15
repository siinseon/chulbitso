import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* 빈티지 놀이터 글로벌 팔레트 */
        background: "#F2E6D0", // Base - 빛바랜 크림 베이지
        primary: "#4A5E42", // Main - 깊은 올리브 그린
        "primary-dark": "#3a4a35", // Hover 등
        "primary-light": "#5a7350", // 그라데이션용
        secondary: "#8C9E83", // Sub - 세이지 그린
        accent: "#C98C6E", // Point - 녹슨 오렌지
        "text-main": "#3A3128", // 부드러운 흙갈색
        muted: "#6B5B4F", // 보조 문구 (따뜻한 갈색)
        /* 기존 클래스명 호환 (같은 팔레트 매핑) */
        point: "#4A5E42",
        "chulbit-bg": "#F2E6D0",
        "chulbit-card": "#FAF6EF",
        ivory: "#FAF6EF",
        "ivory-border": "#E5DCC8",
        "library-card": "#FFF8E7", // 대출 카드 아이보리
      },
      fontFamily: {
        serif: ["var(--font-noto-serif-kr)", "Noto Serif KR", "serif"],
        "nanum-myeongjo": ["var(--font-noto-serif-kr)", "Noto Serif KR", "serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
        handwriting: ["var(--font-handwriting)", "Gaegu", "cursive"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(58, 49, 40, 0.08)",
        "card-lg": "0 4px 16px rgba(58, 49, 40, 0.12)",
        "asset-card": "0 4px 16px rgba(74, 94, 66, 0.18)",
        nav: "0 -2px 10px rgba(58, 49, 40, 0.1)",
        paper: "0 1px 3px rgba(58, 49, 40, 0.06)",
        "card-hover": "0 8px 24px rgba(58, 49, 40, 0.14)",
      },
      borderRadius: {
        DEFAULT: "0.375rem", // rounded-md
      },
    },
  },
  plugins: [],
};
export default config;
