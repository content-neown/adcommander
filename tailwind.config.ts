import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        surface: {
          50:  "#f8f9fa",
          100: "#f0f2f5",
          200: "#e4e7ec",
          700: "#1a1d23",
          800: "#14161c",
          850: "#0f1117",
          900: "#0c0d12",
          950: "#08090e",
        },
        accent: {
          amber:  "#f59e0b",
          green:  "#10b981",
          red:    "#ef4444",
          purple: "#8b5cf6",
          teal:   "#14b8a6",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in":     "fadeIn 0.2s ease",
        "slide-up":    "slideUp 0.25s ease",
        "pulse-slow":  "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
        "spin-slow":   "spin 2s linear infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
export default config;
