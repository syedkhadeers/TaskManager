/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          // Bold royal blue palette
          light: "#3F51B5", // Light royal blue
          dark: "#1E88E5", // Darker royal blue
          50: "#E3F2FD", // Lightest blue
          100: "#BBDEFB", // Light blue
          900: "#0D47A1", // Dark blue
        },
        secondary: {
          // Vibrant coral palette
          light: "#FF6F61", // Light coral
          dark: "#E63946", // Darker coral
          50: "#FFE5E5", // Lightest coral
          100: "#FFB3B3", // Light coral
          900: "#C0392B", // Dark coral
        },
        background: {
          light: "#FAFAFA", // Very light neutral background
          dark: "#121212", // Deep dark background
        },
        text: {
          light: "#212121", // Dark gray for light mode
          dark: "#E0E0E0", // Light gray for dark mode
        },
        neutral: {
          // Added neutral colors for better design flexibility
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
        accent: {
          // Optional accent color
          light: "#FFB300", // Bright gold
          dark: "#FF8F00", // Deeper gold
        },
      },
      // Optional: Add some additional theme customizations
      boxShadow: {
        light:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        dark: "0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)",
      },
    },
  },
  plugins: [],
};
