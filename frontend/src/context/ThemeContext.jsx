import React, { createContext, useState, useEffect, useCallback } from "react";

export const ThemeContext = createContext();

const THEME_STORAGE_KEY = "app-theme";

const defaultThemeColors = {
  light: {
    primary: "#ffffff",
    secondary: "#f3f4f6",
    text: "#111827",
    accent: "#3b82f6",
  },
  dark: {
    primary: "#1f2937",
    secondary: "#111827",
    text: "#f9fafb",
    accent: "#60a5fa",
  },
};

export const ThemeProvider = ({
  children,
  initialTheme = "light",
  customColors = {},
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setThemeState] = useState(initialTheme);
  const [themeColors, setThemeColors] = useState({
    ...defaultThemeColors,
    ...customColors,
  });

  const applyThemeToDOM = useCallback(
    (darkMode) => {
      document.documentElement.classList.toggle("dark", darkMode);

      // Apply theme colors to CSS variables
      Object.entries(themeColors[darkMode ? "dark" : "light"]).forEach(
        ([key, value]) => {
          document.documentElement.style.setProperty(`--color-${key}`, value);
        }
      );
    },
    [themeColors]
  );

  const setTheme = useCallback(
    (newTheme) => {
      const isDark = newTheme === "dark";
      setIsDarkMode(isDark);
      setThemeState(newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      applyThemeToDOM(isDark);
    },
    [applyThemeToDOM]
  );

  const toggleTheme = useCallback(() => {
    const newTheme = isDarkMode ? "light" : "dark";
    setTheme(newTheme);
  }, [isDarkMode, setTheme]);

  const applyTheme = useCallback((customThemeColors) => {
    setThemeColors((prev) => ({
      ...prev,
      ...customThemeColors,
    }));
  }, []);

  // Initialize theme from system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme("dark");
    }
  }, [setTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [setTheme]);

  const contextValue = {
    isDarkMode,
    toggleTheme,
    setTheme,
    theme,
    themeColors,
    applyTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
