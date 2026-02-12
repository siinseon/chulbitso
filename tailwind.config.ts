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
        "vintage-bg": "#F2E6D0",
        primary: "#4A5E42",
        secondary: "#8C9E83",
        "accent-warm": "#C98C6E",
        "accent-cool": "#6A8B9A",
        "text-main": "#3A3128",
        "text-muted": "#8C7B6B",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Noto Serif KR", "serif"],
        myeongjo: ["var(--font-serif-myeongjo)", "Noto Serif KR", "serif"],
        sans: ["var(--font-sans)", "Pretendard", "sans-serif"],
        jua: ["var(--font-jua)", "Jua", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
        paint: ["var(--font-paint)", "Black Han Sans", "sans-serif"],
        pixel: ["var(--font-pixel)", "Press Start 2P", "monospace"],
        handwriting: ["var(--font-handwriting)", "Gaegu", "cursive"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(58, 49, 40, 0.06)",
        "card-lg": "0 4px 24px rgba(58, 49, 40, 0.08)",
        "asset-card": "0 4px 20px rgba(58, 49, 40, 0.1)",
        nav: "0 -2px 12px rgba(58, 49, 40, 0.08)",
      },
      borderRadius: {
        "vintage": "0.75rem",
        "vintage-lg": "1rem",
      },
    },
  },
  plugins: [],
};
export default config;
