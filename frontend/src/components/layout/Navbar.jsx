// src/components/Navbar.jsx
import React, { useState } from "react";
import { IoMdLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import ThemeToggle from "../common/ThemeToggle";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import LogoutModal from "../common/modal/LogoutModal";

const Navbar = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const isLandingPage = location.pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 w-full ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } shadow-lg z-50 transition-colors duration-300`}
    >
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center text-2xl font-bold text-primary-dark">
          <img src="/logo.png" alt="Logo" className="h-8 mr-2" />
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {!isLandingPage && (
            <>
              <button
                className={`p-2 rounded-md hover:text-white ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                onClick={() => navigate("/settings")}
              >
                <IoSettingsOutline />
              </button>
              <button
                className={`p-2 rounded-md hover:text-white ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                onClick={() => setShowLogoutModal(true)}
              >
                <IoMdLogOut />
              </button>
            </>
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
    </nav>
  );
};

export default Navbar;
