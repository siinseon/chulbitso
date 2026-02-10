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
        point: "#11593F",
        "chulbit-bg": "#F2F2F2",
        "chulbit-card": "#FFFFFF",
        ivory: "#FAFAF8",
        "ivory-border": "#EDE9E3",
      },
      fontFamily: {
        "nanum-myeongjo": ["var(--font-nanum-myeongjo)", "serif"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.05)",
        "card-lg": "0 4px 16px rgba(0,0,0,0.1)",
        "asset-card": "0 4px 16px rgba(17,89,63,0.2)",
        nav: "0 -2px 10px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
