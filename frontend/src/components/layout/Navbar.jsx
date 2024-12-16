import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { IoSearch } from "react-icons/io5"; // Import the search icon
import LogoutModal from "../common/modal/LogoutModal";

const Navbar = () => {
  const location = useLocation();
  const { user, handleLogout } = useAuth();
  const isLandingPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isForgotPasswordPage = location.pathname === "/forgot-password";
  const { isDarkMode, toggleTheme } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const navigate = useNavigate();

  const confirmLogout = async () => {
    try {
      await handleLogout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Search query:", searchQuery);
  };

  return (
    <nav className="z-50 py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {user ? (
          <div className="flex items-center space-x-4">
            <form
              onSubmit={handleSearch}
              className={`flex items-center bg-white dark:bg-gray-700 rounded-md shadow-custom-light dark:shadow-custom-dark border ${
                isDarkMode ? "border-neutral-500" : "border-neutral-100"
              }`}
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-2 pl-10 text-sm text-gray-700 dark:text-white rounded-l-md ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
              <button
                type="submit"
                className={`${
                  isDarkMode
                    ? "text-white bg-gradient-light  hover:bg-gradient-dark hover:text-primary-100 "
                    : " text-white bg-gradient-dark  hover:bg-gradient-light hover:text-primary-50 "
                } rounded-r-md p-2  transition duration-200`}
              >
                <IoSearch className="text-white" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div>
              <Link to="/">
                <img
                  src={isDarkMode ? "/logo_dark.png" : "/logo_light.png"}
                  alt="App Logo"
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            <div>
              {isLandingPage && (
                <>
                  <ThemeToggle />
                  <Link
                    to="/login"
                    className={`${
                      isDarkMode
                        ? "px-4 py-2 text-primary-50 bg-gradient-dark border border-gradient-dark rounded-md transition hover:bg-gradient-light hover:text-primary-100 hover:border-primary-dark"
                        : "px-4 py-2 text-primary-100 bg-gradient-light border border-gradient-light rounded-md transition hover:bg-gradient-dark hover:text-primary-50 hover:border-primary-light"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`${
                      isDarkMode
                        ? "px-4 py-2 text-primary-50 bg-gradient-dark border border-gradient-dark rounded-md transition hover:bg-gradient-light hover:text primary-100 hover:border-primary-dark"
                        : "px-4 py-2 text-primary-100 bg-gradient-light border border-gradient-light rounded -md transition hover:bg-gradient-dark hover:text-primary-50 hover:border-primary-light"
                    }`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              {(isLoginPage || isRegisterPage || isForgotPasswordPage) && (
                <ThemeToggle />
              )}
            </div>
          </div>
        )}
        {user && (
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              className={`${
                isDarkMode
                  ? "px-3 py-3 text-white bg-gradient-light rounded-lg transition hover:bg-gradient-dark hover:text-primary-100 border border-neutral-500 shadow-custom-dark"
                  : "px-3 py-3 text-white bg-gradient-dark rounded-lg transition hover:bg-gradient-light hover:text-primary-50 border border-neutral-100"
              }`}
              onClick={() => navigate("/settings")}
            >
              <IoSettingsOutline />
            </button>
            <button
              className={`${
                isDarkMode
                  ? "px-3 py-3 text-white bg-gradient-light rounded-lg transition hover:bg-gradient-dark hover:text-primary-100 border border-neutral-500 shadow-custom-dark"
                  : "px-3 py-3 text-white bg-gradient-dark rounded-lg transition hover:bg-gradient-light hover:text-primary-50 border border-neutral-100 shadow-custom-light"
              }`}
              onClick={() => setShowLogoutModal(true)}
            >
              <IoMdLogOut />
            </button>
          </div>
        )}
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
    </nav>
  );
};

export default Navbar;
