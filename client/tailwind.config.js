import rtlPlugin from "tailwindcss-rtl";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c2d4ff",
          300: "#9bb5ff",
          400: "#7189ff",
          500: "#4f5eff",
          600: "#3a3ff5",
          700: "#2f2fd1",
          800: "#2828a6",
          900: "#26277f",
        },
        accent: {
          400: "#ff8fd6",
          500: "#ff5fc0",
          600: "#e63fa3",
        },
        mint: {
          400: "#4fe0c5",
          500: "#22c9ab",
        },
        sunshine: {
          300: "#ffe08a",
          400: "#ffd166",
        },
      },
      fontFamily: {
        display: ["'Baloo 2'", "system-ui", "sans-serif"],
        body: ["'Nunito'", "system-ui", "sans-serif"],
      },
      fontWeight: {
        500: "500",
        600: "600",
        700: "700",
        800: "800",
        900: "900",
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at 20% 20%, #7189ff 0%, transparent 45%), radial-gradient(circle at 80% 0%, #ff8fd6 0%, transparent 40%), radial-gradient(circle at 50% 100%, #4fe0c5 0%, transparent 45%), linear-gradient(135deg, #1a1a3d 0%, #2b1a4d 60%, #1a1a3d 100%)",
        "hero-gradient-2": "radial-gradient(circle at 20% 20%, #4fe0c5 0%, transparent 45%), radial-gradient(circle at 80% 0%, #ffd166 0%, transparent 40%), radial-gradient(circle at 50% 100%, #7189ff 0%, transparent 45%), linear-gradient(135deg, #123a3d 0%, #0f3d2e 60%, #123a3d 100%)",
        "hero-gradient-3": "radial-gradient(circle at 20% 20%, #ff5fc0 0%, transparent 45%), radial-gradient(circle at 80% 0%, #ffd166 0%, transparent 40%), radial-gradient(circle at 50% 100%, #4f5eff 0%, transparent 45%), linear-gradient(135deg, #3d1a2b 0%, #4d2b1a 60%, #3d1a2b 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
        glow: "0 0 40px rgba(113, 137, 255, 0.4)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.6 },
        },
      },
    },
  },
  plugins: [rtlPlugin],
};
