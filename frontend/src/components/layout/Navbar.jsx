import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Settings, LogOut, ChevronDown } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import LogoutModal from "../common/modal/LogoutModal";
import { getCurrentUser } from "../../services/authServices";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { user, handleLogout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const confirmLogout = async () => {
    try {
      await handleLogout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };



  return (
    <div className="flex items-center justify-end h-full px-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <img
              src={user?.photo.url || "https://via.placeholder.com/32"}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Welcome,
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || "User  "}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
              <button
                onClick={() => navigate("/settings")}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </button>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {showLogoutModal && (
        <LogoutModal
          isDarkMode={isDarkMode}
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={() => {
            confirmLogout();
            setShowLogoutModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Navbar;
