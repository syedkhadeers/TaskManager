import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../hooks/useTheme";
import { MdLightMode, MdModeNight } from "react-icons/md";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-md hover:text-white ${
        isDarkMode
          ? "bg-gray-900 text-white/50 hover:bg-gray-700"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      }`}
    >
      {isDarkMode ? (
        // <FaMoon className="w-5 h-5" />
        <MdLightMode />
      ) : (
        // <FaSun className="w-5 h-5" />
        <MdModeNight />
      )}
    </button>
  );
};

export default ThemeToggle;
