import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const MenuItem = ({
    icon: Icon,
    label,
    to,
    hasSubmenu,
    isOpen,
    onClick,
    isActive,
  }) => (
    <div>
      <Link
        to={to || "#"}
        onClick={onClick}
        className={`
          flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200
          ${
            isActive
              ? "bg-blue-500/10 text-blue-500"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }
        `}
      >
        <div className="flex items-center space-x-3">
          <Icon className="h-5 w-5" />
          <span className="font-medium">{label}</span>
        </div>
        {hasSubmenu && (
          <span className="text-gray-400">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
      </Link>
    </div>
  );

  const Submenu = ({ isOpen, children }) =>
    isOpen && <div className="ml-6 mt-2 space-y-1">{children}</div>;

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 w-full justify-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo_light.png" alt="Logo" className="h-8 w-full" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <MenuItem
          icon={LayoutDashboard}
          label="Dashboard"
          to="/dashboard"
          isActive={location.pathname === "/dashboard"}
        />
        <MenuItem
          icon={Users}
          label="Users"
          to="/users"
          isActive={location.pathname === "/users"}
        />
        <MenuItem
          icon={Building2}
          label="Rooms"
          hasSubmenu
          isOpen={openMenus.rooms}
          onClick={() => toggleMenu("rooms")}
          isActive={location.pathname.startsWith("/rooms")}
        />
        <Submenu isOpen={openMenus.rooms}>
          <MenuItem
            icon={Building2}
            label="Room Types"
            to="/room-types"
            isActive={location.pathname === "/room-types"}
          />
          <MenuItem
            icon={Building2}
            label="All Rooms"
            to="/rooms"
            isActive={location.pathname === "/rooms"}
          />
        </Submenu>
        <MenuItem
          icon={Settings}
          label="Settings"
          to="/settings"
          isActive={location.pathname === "/settings"}
        />
      </nav>

      {/* Version */}
      <div className="px-3 py-4">
        <div className="px-3 py-2 text-xs text-gray-400">Version 1.0.2</div>
      </div>
    </div>
  );
};

export default Sidebar;
