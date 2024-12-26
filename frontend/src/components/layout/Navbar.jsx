import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  Bell,
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
import { logoutUser, getCurrentUser } from "../../services/auth/authServices";
import { toast } from "react-toastify";
import ChangeMePasswordModal from "../reusables/modal/ChangeMePasswordModal";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { user, handleLogout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await getCurrentUser();
        if (response?.data) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        toast.error("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayUser = currentUser || user;

  const confirmLogout = async () => {
    try {
      await logoutUser();
      await handleLogout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700"
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="ml-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-64 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <button className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
              </button>

              <div className="relative" ref={dropdownRef}>
                {isLoading ? (
                  <div className="flex items-center space-x-3 p-2 rounded-lg min-w-[200px]">
                    <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
                    <div className="hidden md:flex flex-col flex-1">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
                      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[200px] transition-colors duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                  >
                    <img
                      src={displayUser?.photo?.url || "/default-avatar.png"}
                      alt={displayUser?.fullName || "User"}
                      className="h-8 w-8 rounded-lg object-cover shrink-0"
                    />
                    <div className="hidden md:block text-left flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {displayUser?.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {displayUser?.role === "user" && "User"}
                        {displayUser?.role === "admin" && "Admin"}
                        {displayUser?.role === "creator" && "Creator"}
                        {displayUser?.role === "superadmin" && "Super Admin"}
                        {displayUser?.role === "manager" && "Manager"}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                )}

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={() => navigate("/me")}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Eye className="mr-3 h-4 w-4" />
                      View Profile
                    </button>
                    <button
                      onClick={() => navigate("/settings")}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
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
      </motion.nav>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <LogoutModal
            isDarkMode={isDarkMode}
            onCancel={() => setShowLogoutModal(false)}
            onConfirm={async () => {
              await confirmLogout();
              setShowLogoutModal(false);
            }}
          />
        </div>
      )}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <ChangeMePasswordModal onClose={() => setShowPasswordModal(false)} />
        </div>
      )}
    </>
  );
};

export default Navbar;
