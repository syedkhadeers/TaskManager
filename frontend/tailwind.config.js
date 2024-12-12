/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#A052B3", // Light variant of the new primary color
          dark: "#850481", // New primary color
          50: "#EAB8E4", // Very Light variant
          100: "#D18CC7", // Soft variant
          900: "#5B004D", // Deep variant
        },
        secondary: {
          light: "#FF4F7D", // Light variant of the new secondary color
          dark: "#FF005C", // New secondary color
          50: "#FFE1E6", // Very Light variant
          100: "#FFB3C1", // Soft variant
          900: "#A6003A", // Deep variant
        },
        background: {
          light: "#F5F7FA", // Neutral background
          dark: "#1F1F1F", // Very Dark Gray
        },
        text: {
          light: "#333333", // Dark Gray
          dark: "#E0E0E0", // Light Gray
        },
        accent: {
          light: "#FFB300", // Gold
          dark: "#FFC107", // Amber
        },
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      boxShadow: {
        "custom-light":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "custom-dark":
          "0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)",
      },
      navShadow: {
        "nav-shadow-light": "shadow-md rgb(31, 41, 55) rgb(31, 41, 55)",
        "nav-shadow-dark": "shadow-lg rgb(249, 250, 251) rgb(31, 41, 55)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      backgroundImage: {
        "gradient-light": "linear-gradient(to bottom, #850481, #FF005C)", // Light gradient
        "gradient-dark": "linear-gradient(to bottom, #FF005C, #850481)", // Dark gradient
        "custom-bg-light":
          "linear-gradient(rgba(0, 35, 82, 0.7), rgba(0, 35, 82, 0.7)), url('./menu_bg2.jpg')",
        "custom-bg-dark":
          "linear-gradient(rgba(0, 35, 82, 0.7), rgba(0, 35, 82, 0.7)), url('./menu_bg2.jpg')",
      },
      backgroundSize: {
        "auto-100": "auto 100%",
        "cover-100": "cover",
      },
      backgroundPosition: {
        "center-center": "center center",
      },
      buttonBackground: {
        "button-primary-light": "linear-gradient(to right, #FF005C, #850481 )", // Light button gradient
        "button-primary-dark": "linear-gradient(to right, #850481, #FF005C)", // Dark button gradient
      },
      borderColor: {
        primary: "#850481", // Primary border color
        secondary: "#FF005C", // Secondary border color
        dark: "#675E5E",
        light: "#FFFFFF",
      },
    },
  },
  plugins: [],
};

