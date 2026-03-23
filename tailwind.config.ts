import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#07101c",
        foreground: "#e6edf6",
        card: "#0d1726",
        cardForeground: "#e6edf6",
        border: "#1d324d",
        muted: "#7d92ad",
        accent: "#ca9127",
        accentForeground: "#07101c",
        success: "#47c97e",
        danger: "#ef6b73",
        warning: "#f1b545"
      },
      boxShadow: {
        terminal: "0 0 0 1px rgba(29, 50, 77, 0.75), 0 18px 60px rgba(0, 0, 0, 0.35)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};

export default config;
