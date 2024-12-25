import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  const { isDarkMode, toggleTheme, setTheme, theme, themeColors, applyTheme } =
    context;

  return {
    isDarkMode,
    toggleTheme,
    setTheme,
    theme,
    themeColors,
    applyTheme,
    isLight: !isDarkMode,
  };
};


// // Usage : 

// import { useTheme } from "../hooks/useTheme";

// const ThemeToggle = () => {
//   const { isDarkMode, toggleTheme } = useTheme();

//   return (
//     <button onClick={toggleTheme} className="theme-toggle-btn">
//       {isDarkMode ? "🌙" : "☀️"}
//     </button>
//   );
// };
