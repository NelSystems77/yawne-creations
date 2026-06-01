import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#070F1A",
          900: "#0D1B2A",
          800: "#1A2744",
          700: "#1E3254",
          600: "#25406B",
        },
        silver: {
          100: "#FFFFFF",
          200: "#E8F0F8",
          300: "#C8E4F8",
          400: "#B8D4E8",
          500: "#8DAEC8",
        },
        glow: "#C8DEFF",
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(ellipse at 50% 0%, #1E3254 0%, #0D1B2A 60%, #070F1A 100%)",
        "card-gradient":
          "linear-gradient(135deg, #1A2744 0%, #0D1B2A 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(200, 222, 255, 0.15)",
        "glow-lg": "0 0 40px rgba(200, 222, 255, 0.2)",
        card: "0 4px 24px rgba(7, 15, 26, 0.6)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
