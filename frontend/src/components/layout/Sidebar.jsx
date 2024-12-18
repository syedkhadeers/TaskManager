import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaUserPlus,
  FaRegUser ,
  FaStore,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../common/ThemeToggle"; // Import ThemeToggle
import { IoMdLogOut } from "react-icons/io";
import LogoutModal from "../common/modal/LogoutModal";
import { IoSettingsOutline } from "react-icons/io5";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const onLogout = async () => {
    try {
      await handleLogout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  const MenuItem = ({ icon, label, to, hasSubmenu, isOpen, onClick }) => (
    <div>
      <Link
        to={to || "#"}
        onClick={onClick}
        className={`flex items-center justify-between p-3 rounded-md transition-all duration-200 ${
          isDarkMode
            ? "text-gray-300 hover:bg-gray-700"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">{icon}</span>
          <span className="font-medium">{label}</span>
        </div>
        {hasSubmenu && (
          <span className="text-gray-400">
            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        )}
      </Link>
    </div>
  );

  const Submenu = ({ isOpen, children }) => (
    isOpen && <div className="ml-6 mt-2 space-y-2">{children}</div>
  );

  return (
    <div className={`flex flex-col h-full`}>
      {/* Logo Section */}
      <div className="flex items-center justify-center p-5 border-b dark:border-gray-700">
        <Link to="/">
          <img
            src={isDarkMode ? "/logo_dark.png" : "/logo_light.png"}
            alt="App Logo"
            className="h-8 w-auto"
          />
        </Link>
      </div>

      {/* Scrollable Navigation */}
      <nav
        className="flex-1 p-4 space-y-3 overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: isDarkMode ? "#333 #222" : "#ccc #eee",
        }}
      >
        <style>
          {`
            ::-webkit-scrollbar {
              width: 8px;
            }
            ::-webkit-scrollbar-thumb {
              background: ${isDarkMode ? "#333" : "#ccc"};
              border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: ${isDarkMode ? "#444" : "#ddd"};
            }
            ::-webkit-scrollbar-track {
              background: ${isDarkMode ? "#222" : "#eee"};
            }
          `}
        </style>

        <MenuItem
          icon={<FaTachometerAlt />}
          label="Dashboard"
          to="/dashboard"
        />

        {/* Users Menu */}
        <MenuItem
          icon={<FaUsers />}
          label="Users"
          hasSubmenu
          isOpen={openMenus.users}
          onClick={() => toggleMenu("users")}
        />
        <Submenu isOpen={openMenus.users}>
          <MenuItem icon={<FaUserPlus />} label="Add Users" to="/users/add" />
          <MenuItem icon={<FaRegUser />} label="All Users" to="/users" />
        </Submenu>

        {/* Customers Menu */}
        <MenuItem
          icon={<FaStore />}
          label="Customers"
          hasSubmenu
          isOpen={openMenus.customers}
          onClick={() => toggleMenu("customers")}
        />
        <Submenu isOpen={openMenus.customers}>
          <MenuItem
            icon={<FaUserPlus />}
            label="Add Customer"
            to="/customers/add"
          />
          <MenuItem
            icon={<FaRegUser />}
            label="All Customers"
            to="/customers"
          />
        </Submenu>

        {/* Suppliers Menu */}
        <MenuItem
          icon={<FaStore />}
          label="Suppliers"
          hasSubmenu
          isOpen={openMenus.suppliers}
          onClick={() => toggleMenu("suppliers")}
        />
        <Submenu isOpen={openMenus.suppliers}>
          <MenuItem
            icon={<FaUserPlus />}
            label="Add Supplier"
            to="/suppliers/add"
          />
          <MenuItem
            icon={<FaRegUser />}
            label="All Suppliers"
            to="/suppliers"
          />
        </Submenu>

        {/* Form Elements */}
        <MenuItem
          icon={<FaStore />}
          label="Form Elements"
          hasSubmenu
          isOpen={openMenus.formelements}
          onClick={() => toggleMenu("formelements")}
        />
        <Submenu isOpen={openMenus.formelements}>
          <MenuItem
            icon={<FaUserPlus />}
            label="Basics"
            to="/form-elements/basic"
          />
          <MenuItem
            icon={<FaRegUser />}
            label="Intermediate"
            to="/form-elements/intermediate"
          />
          <MenuItem
            icon={<FaRegUser />}
            label="Advanced"
            to="/form-elements/advanced"
          />
        </Submenu>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t dark:border-gray-700">
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
    </div>
  );
};

export default Sidebar;