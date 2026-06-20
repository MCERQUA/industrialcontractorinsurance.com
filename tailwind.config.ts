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
        cream: "#F5F7FA",
        sand: "#E8EDF4",
        white: "#FFFFFF",
        clay: {
          DEFAULT: "#2C3E50",
          dark: "#1A252F",
          light: "#3D5166",
          50: "#EAF0F4",
          100: "#CFD9E5",
          200: "#A0B3C6",
          300: "#6E8EA7",
          400: "#4A7090",
          500: "#3D5166",
          600: "#2C3E50",
          700: "#1A252F",
          800: "#101820",
          900: "#080D14",
        },
        sage: {
          DEFAULT: "#2980B9",
          dark: "#1F6491",
          light: "#5DA8D8",
          50: "#E8F4FB",
          100: "#C8E4F4",
          200: "#94C9E8",
          300: "#5DA8D8",
          400: "#3B93CB",
          500: "#2980B9",
          600: "#1F6491",
          700: "#174D70",
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
        espresso: "#1A1E2E",
        cocoa: "#3D4A58",
        mocha: "#6B7A8D",
        adobe: "#D0D8E4",
        adobeDark: "#B8C4D4",
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
          "linear-gradient(180deg, #F5F7FA 0%, #EAF0F4 40%, #E8EDF4 70%, #F5F7FA 100%)",
        "warm-radial":
          "radial-gradient(circle at 30% 20%, rgba(44,62,80,0.10) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(41,128,185,0.08) 0%, transparent 55%)",
        "clay-gradient": "linear-gradient(135deg, #2C3E50 0%, #3D5166 100%)",
        "sage-gradient": "linear-gradient(135deg, #2980B9 0%, #5DA8D8 100%)",
        "gold-gradient": "linear-gradient(135deg, #E67E22 0%, #F0A04B 100%)",
      },
      boxShadow: {
        warm: "0 10px 40px -15px rgba(26,37,47,0.28), 0 4px 12px -6px rgba(26,30,46,0.10)",
        "warm-lg": "0 30px 70px -20px rgba(26,37,47,0.32), 0 10px 30px -10px rgba(26,30,46,0.12)",
        card: "0 2px 8px -2px rgba(26,30,46,0.08), 0 1px 3px -1px rgba(26,30,46,0.05)",
        "card-hover": "0 20px 50px -15px rgba(41,128,185,0.22), 0 8px 20px -8px rgba(26,30,46,0.12)",
        arch: "inset 0 -8px 30px -10px rgba(44,62,80,0.12)",
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
