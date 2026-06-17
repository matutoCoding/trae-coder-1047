/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: "#e6f0ff",
          100: "#bae0ff",
          200: "#91caff",
          300: "#69b1ff",
          400: "#4096ff",
          500: "#1677ff",
          600: "#0958d9",
          700: "#003eb3",
          800: "#002c8c",
          900: "#001d66",
        },
        success: {
          50: "#f6ffed",
          100: "#d9f7be",
          500: "#52c41a",
          600: "#389e0d",
          700: "#237804",
        },
        warning: {
          50: "#fffbe6",
          100: "#fff1b8",
          500: "#fa8c16",
          600: "#d46b08",
          700: "#ad4e00",
        },
        danger: {
          50: "#fff1f0",
          100: "#ffccc7",
          500: "#ff4d4f",
          600: "#cf1322",
          700: "#a8071a",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e8e8e8",
          300: "#d9d9d9",
          400: "#bfbfbf",
          500: "#8c8c8c",
          600: "#595959",
          700: "#434343",
          800: "#262626",
          900: "#1f1f1f",
          950: "#141414",
        },
        power: {
          bg: "#f0f5ff",
          card: "#ffffff",
          border: "#e5e7eb",
          text: "#1f2937",
          textSecondary: "#6b7280",
        },
      },
      fontFamily: {
        sans: [
          "PingFang SC",
          "Microsoft YaHei",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: ["Roboto Mono", "Consolas", "Monaco", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 4px 12px rgba(22, 119, 255, 0.15)",
        nav: "2px 0 8px rgba(0, 0, 0, 0.06)",
      },
      transitionProperty: {
        "width": "width",
        "spacing": "margin, padding",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
