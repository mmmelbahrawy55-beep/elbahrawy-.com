import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#050505",
        foreground: "#ffffff",
        card: "#0F0F0F",
        "card-foreground": "#ffffff",
        primary: "#FFD700",
        "primary-foreground": "#050505",
        muted: "#1A1A1A",
        "muted-foreground": "#A0A0A0",
        border: "rgba(255,215,0,0.1)",
      },
      fontFamily: {
        sans: ["Inter", "Cairo", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "24px",
        md: "16px",
      },
      boxShadow: {
        glow: "0 0 15px rgba(255,215,0,0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
