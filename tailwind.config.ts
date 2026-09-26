import type { Config } from "tailwindcss";

/* ============================================================
   INDUSTRIAL CONTRACTOR INSURANCE — "Steel & Slate" palette
   clay = dark charcoal/steel · sage = steel blue · gold = industrial orange
   cream = cool light gray · sand = pale steel
   ============================================================ */

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF9F4",
        sand: "#F1ECE4",
        white: "#FFFFFF",
        clay: {
          DEFAULT: "#38322D",
          dark: "#221E1A",
          light: "#57504A",
          50: "#F4F2EF",
          100: "#E3DEDA",
          200: "#C6BDB5",
          300: "#A1968B",
          400: "#7A6F65",
          500: "#57504A",
          600: "#38322D",
          700: "#221E1A",
          800: "#16130F",
          900: "#0C0A08",
        },
        sage: {
          DEFAULT: "#4E6B38",
          dark: "#3C5329",
          light: "#8AA86A",
          50: "#F1F5EC",
          100: "#DCE7D0",
          200: "#BBD1A2",
          300: "#8AA86A",
          400: "#6B8A4E",
          500: "#4E6B38",
          600: "#3C5329",
          700: "#2C3E1E",
        },
        gold: {
          DEFAULT: "#E67E22",
          dark: "#CA6F1E",
          light: "#F0A04B",
          50: "#FDF2E9",
          100: "#FAE0C4",
          200: "#F5C08C",
          300: "#F0A04B",
          400: "#E88A2A",
          500: "#E67E22",
          600: "#CA6F1E",
        },
        espresso: "#1C1814",
        cocoa: "#45403A",
        mocha: "#6B625A",
        adobe: "#E0D8CE",
        adobeDark: "#CEC4B8",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        arch: "2rem 2rem 2rem 2rem",
        arch2: "2.5rem 2.5rem 1.5rem 1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backgroundImage: {
        "sunrise-bands":
          "linear-gradient(180deg, #FBF9F4 0%, #F4F2EF 40%, #F1ECE4 70%, #FBF9F4 100%)",
        "warm-radial":
          "radial-gradient(circle at 30% 20%, rgba(56,50,45,0.10) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(78,107,56,0.08) 0%, transparent 55%)",
        "clay-gradient": "linear-gradient(135deg, #38322D 0%, #57504A 100%)",
        "sage-gradient": "linear-gradient(135deg, #4E6B38 0%, #8AA86A 100%)",
        "gold-gradient": "linear-gradient(135deg, #E67E22 0%, #F0A04B 100%)",
      },
      boxShadow: {
        warm: "0 10px 40px -15px rgba(34,30,26,0.28), 0 4px 12px -6px rgba(28,24,20,0.10)",
        "warm-lg": "0 30px 70px -20px rgba(34,30,26,0.32), 0 10px 30px -10px rgba(28,24,20,0.12)",
        card: "0 2px 8px -2px rgba(28,24,20,0.08), 0 1px 3px -1px rgba(28,24,20,0.05)",
        "card-hover": "0 20px 50px -15px rgba(78,107,56,0.22), 0 8px 20px -8px rgba(28,24,20,0.12)",
        arch: "inset 0 -8px 30px -10px rgba(56,50,45,0.12)",
      },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "slow-zoom": { "0%, 100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.05)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "arch-rise": { "0%": { transform: "scaleY(0.6)", opacity: "0", transformOrigin: "bottom" }, "100%": { transform: "scaleY(1)", opacity: "1", transformOrigin: "bottom" } },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
        "slow-zoom": "slow-zoom 20s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "arch-rise": "arch-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
