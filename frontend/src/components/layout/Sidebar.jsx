import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  ChevronDown,
  BarChart,
  Calendar,
  MessageSquare,
  LogOut,
  Clock,
  Package,
  Building,
} from "lucide-react";

const Sidebar = ({ isOpen }) => {
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const toggleMenu = (menuKey) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const MenuItem = ({
    icon: Icon,
    label,
    to,
    hasSubmenu,
    isActive,
    onClick,
  }) => (
    <div className="relative">
      <Link
        to={to || "#"}
        onClick={onClick}
        className={`
          flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
          ${
            isActive
              ? "bg-white/20 text-white"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          }
        `}
      >
        <Icon className="h-5 w-5" />
        <span className="font-medium flex-1">{label}</span>
        {hasSubmenu && (
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              openMenus[label.toLowerCase()] ? "rotate-180" : ""
            }`}
          />
        )}
      </Link>
    </div>
  );

  const SubMenuItem = ({ icon: Icon, label, to, isActive }) => (
    <Link
      to={to}
      className={`
        flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ml-4
        ${
          isActive
            ? "bg-white/20 text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }
      `}
    >
      <Icon className="h-4 w-4" />
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );

  const roomsSubmenuItems = [
    { icon: Package, label: "Extra Services", path: "/extra-services" },
    { icon: Clock, label: "Time Slots", path: "/time-slots" },
    { icon: Building, label: "Room Types", path: "/room-types" },
    { icon: Building2, label: "All Rooms", path: "/rooms" },
  ];

  return (
    <div className="h-full flex flex-col text-white">
      <div className="p-6">
        <motion.img
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          src="/logo_white.png"
          alt="Logo"
          className="h-12 mx-auto filter drop-shadow-lg"
        />
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="space-y-1">
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
          {/* Rooms Menu with Submenu */}
          <div className="space-y-1">
            <MenuItem
              icon={Building2}
              label="Rooms"
              hasSubmenu
              onClick={() => toggleMenu("rooms")}
            />
            <AnimatePresence>
              {openMenus.rooms && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 overflow-hidden"
                >
                  {roomsSubmenuItems.map((item, index) => (
                    <SubMenuItem
                      key={index}
                      icon={item.icon}
                      label={item.label}
                      to={item.path}
                      isActive={location.pathname === item.path}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <MenuItem
            icon={BarChart}
            label="Analytics"
            to="/analytics"
            isActive={location.pathname === "/analytics"}
          />
          <MenuItem
            icon={Calendar}
            label="Calendar"
            to="/calendar"
            isActive={location.pathname === "/calendar"}
          />
          <MenuItem
            icon={MessageSquare}
            label="Messages"
            to="/messages"
            isActive={location.pathname === "/messages"}
          />
        </div>

        <div className="pt-4 mt-4 border-t border-white/10">
          <MenuItem
            icon={Settings}
            label="Settings"
            to="/settings"
            isActive={location.pathname === "/settings"}
          />
          <MenuItem icon={LogOut} label="Logout" to="/logout" />
        </div>
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-white/10 rounded-lg p-4">
          <p className="text-sm font-medium">Need Help?</p>
          <p className="text-xs text-white/70 mt-1">Check our documentation</p>
          <button className="mt-3 w-full px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
            View Docs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
