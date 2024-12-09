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
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Avatar from "react-avatar";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../common/ThemeToggle";

const Sidebar = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    users: false,
    customers: false,
    suppliers: false,
  });
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

  const MenuItem = ({
    icon,
    label,
    to,
    onClick,
    hasSubmenu = false,
    isOpen = false,
  }) => (
    <div className="w-full">
      <Link
        to={to || "#"}
        onClick={onClick}
        className={`flex justify-between items-center w-full p-4 text-gray-200 dark:text-gray-100 dark:hover:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-100 rounded-md transition duration-200`}
      >
        <div className="flex items-center space-x-3">
          {icon}
          <span className="font-semibold">{label}</span>
        </div>
        {hasSubmenu && (isOpen ? <FaChevronDown /> : <FaChevronRight />)}
      </Link>
    </div>
  );

  const Submenu = ({ children, isOpen }) =>
    isOpen && <div className="pl-8 space-y-2">{children}</div>;

  const SidebarContent = () => (
    <div className="flex flex-col p-4 space-y-3">
      <MenuItem icon={<FaTachometerAlt />} label="Dashboard" to="/dashboard" />
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
        <MenuItem icon={<FaRegUser />} label="All Customers" to="/customers" />
      </Submenu>
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
        <MenuItem icon={<FaRegUser />} label="All Suppliers" to="/suppliers" />
      </Submenu>
      <MenuItem icon={<FaCog />} label="Settings" to="/settings" />
      <MenuItem icon={<FaSignOutAlt />} label="Logout" onClick={onLogout} />
    </div>
  );

  const handleMobileSidebarToggle = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="lg:block w-64 bg-gray-900 text-white dark:text-black shadow-lg z-10 left-0 h-auto top-20 bottom-5 fixed overflow-y-auto rounded-lg transition-all duration-300">
      <div className="p-4 border-b">
        {/* Footer content replaced the logo */}
        <div className="text-center text-gray-400">
          <div className="w-full p-4 ">
            <div className="flex items-center space-x-3">
              <Avatar
                name={user?.name || "User"}
                size="40"
                round
                src={user?.avatar}
              />
              <div>
                <div className="font-semibold">{user?.name}</div>
                <div className="text-sm text-gray-500">{user?.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SidebarContent />
      <div
        className="absolute top-4 right-4 lg:hidden p-2 rounded-full transition-all duration-200 hover:bg-gray-500"
        onClick={handleMobileSidebarToggle}
      >
        {isMobileSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>
    </div>
  );
};

export default Sidebar;
