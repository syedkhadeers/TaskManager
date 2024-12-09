/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#4A90E2", // Sky Blue
          dark: "#0066CC", // Deep Blue
          50: "#E6F2FF", // Very Light Blue
          100: "#B3D9FF", // Light Blue
          900: "#00468B", // Dark Blue
        },
        secondary: {
          light: "#FF6F61", // Coral
          dark: "#D9534F", // Dark Coral
          50: "#FFE5E3", // Very Light Coral
          100: "#FFB3A6", // Light Coral
          900: "#B22222", // Dark Coral
        },
        background: {
          light: "#F5F7FA", // Light Gray
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
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
