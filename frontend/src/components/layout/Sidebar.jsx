import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaUserPlus,
  FaRegUser,
  FaStore,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const { isDarkMode } = useContext(ThemeContext);
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = (menuName) =>
    setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));

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

  const Submenu = ({ isOpen, children }) =>
    isOpen && <div className="ml-6 mt-2 space-y-2">{children}</div>;

  return (    
    <div className={`flex flex-col h-full `}>
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
          scrollbarColor: isDarkMode
            ? "bg-gradient-dark"
            : "bg-gradient-light",
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
          <MenuItem
            icon={<FaUserPlus />}
            label="Add Users"
            to="/users/add"
          />
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

        {/* Settings and Logout */}
        <div className="pt-4 border-t dark:border-gray-700">
          <MenuItem icon={<FaCog />} label="Settings" to="/settings" />
          <MenuItem
            icon={<FaSignOutAlt />}
            label="Logout"
            onClick={onLogout}
          />
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-center text-neutral-500 text-sm dark:border-gray-700 dark:text-gray-400">
        Version 1.02.01
      </div>
    </div>
  );
};

export default Sidebar;
