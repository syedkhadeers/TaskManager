import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  Search,
  Menu,
  Eye,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import LogoutModal from "../reusables/modal/LogoutModal";
import ChangeMePasswordModal from "../reusables/modal/ChangeMePasswordModal";


const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = React.useContext(ThemeContext);
  const { user, logout } = useAuth();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const dropdownRef = useRef(null);
 



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const confirmLogout = async () => {
  try {
    setShowLogoutModal(false);
    await logout();
    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


  const userFullName = user?.fullName || "Guest User";
  const userRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Guest";
  const userPhotoUrl = user?.photo?.url || "/default-avatar.png";


  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2.5 w-72 rounded-xl bg-gray-100 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[200px] transition-colors duration-200"
              >
                <img
                  src={userPhotoUrl}
                  alt="Profile"
                  className="h-8 w-8 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
                <div className="hidden md:block text-left flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {userFullName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {userRole}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <button
                    onClick={() => {
                      navigate("/me");
                      setShowDropdown(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Eye className="mr-3 h-4 w-4" />
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordModal(true);
                      setShowDropdown(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Change Password
                  </button>
                  <button
                    onClick={() => {
                      setShowLogoutModal(true);
                      setShowDropdown(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <LogoutModal
          isDarkMode={isDarkMode}
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
        />
      )}

      {showPasswordModal && (
        <ChangeMePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </motion.nav>
  );
};

export default Navbar;
