import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "Nunito Sans", "Inter", "sans-serif"],
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"]
      },
      colors: {
        track: {
          cloud: "#F7FCFF",
          ice: "#E6F7FF",
          aqua: "#8FD8F7",
          sky: "#0A96F0",
          ocean: "#0759A8",
          navy: "#082844",
          red: "#F1222E",
          yellow: "#FFD42A"
        }
      },
      boxShadow: {
        track: "0 18px 48px rgba(6, 58, 120, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
