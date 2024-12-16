import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { MdLightMode, MdModeNight } from "react-icons/md";
import { Link } from "react-router-dom";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <>
      <button
        onClick={toggleTheme}
        className={`${
          isDarkMode
            ? "px-3 py-3 text-white bg-gradient-light rounded-lg transition hover:bg-gradient-dark hover:text-primary-100 border border-neutral-500 shadow-custom-dark"
            : "px-3 py-3 text-white bg-gradient-dark rounded-lg transition hover:bg-gradient-light hover:text-primary-50 border border-neutral-100 shadow-custom-light"
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
    </>
  );
};

export default ThemeToggle;

