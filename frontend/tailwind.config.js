import scrollbarPlugin from "tailwind-scrollbar";
import scrollbarHide from "tailwind-scrollbar-hide";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          primary: "#A855F7", // A shade of purple for secondary color
          secondary: "#3B82F6", // Soft blue for primary color
          accentPrimary: "#6D28D9", // Darker shade for accent primary
          accentSecondary: "#1D4ED8", // Darker shadfe for accent secondary
          background: "#FAF9F6", // Off white
          foreground: "#1E3A8A", // Dark blue for text
          surface: "#FFFFFF", // Pure white for cards and surfaces
          muted: "#B0BEC5", // Muted blue-gray for secondary text
          text: {
            primary: "#1E3A8A", // Dark blue for primary text
            secondary: "#64748B", // Muted blue-gray for secondary text
          },
        },
        dark: {
          primary: "#6D28D9", // A shade of purple for secondary color
          secondary: "#1D4ED8", // Strong blue for primary color
          accentPrimary: "#A855F7", // Darker shade for accent primary (e.g., deep purple)
          accentSecondary: "#2563EB", // Darker shade for accent secondary
          background: "#0B0C10", // Dark navy for background
          foreground: "#E5E7EB", // Light gray
          surface: "#1F2937", // Darker surface for cards
          muted: "#9CA3AF", // Muted gray for secondary text
          text: {
            primary: "#F1F5F9", // Very light gray for primary text
            secondary: "#D1D5DB", // Muted gray for secondary text on dark mode
          },
        },
      },
      fontFamily: {
        f1: ["Gelasio", "serif"],
        f2: ["Dancing", "serif"],
      },
      scrollbar: {
        width: "12px",
        track: {
          light: "#E0E0E0", // Light mode track color
          dark: "#333333", // Dark mode track color
        },
        thumb: {
          light: "#a0a0a0", // Light mode thumb color
          dark: "#555555", // Dark mode thumb color
          hover: "#808080", // Hover color for thumb
        },
      },
      animation: {
        "bounce-slow": "bounce 1s ease-in-out infinite",
      },
    },
  },
  plugins: [
    scrollbarHide,
    scrollbarPlugin({
      nocompatible: true,
      preferredStrategy: "pseudoelements",
    }),
  ],
  darkMode: "class",
};

export default config;
