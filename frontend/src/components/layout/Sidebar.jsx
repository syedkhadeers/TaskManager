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
import "../../styles/Sidebar.css";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  // Define submenu items first
  const roomsSubmenuItems = [
    { icon: Package, label: "Extra Services", path: "/extra-services" },
    { icon: Clock, label: "Time Slots", path: "/time-slots" },
    { icon: Building, label: "Room Types", path: "/room-types" },
    { icon: Building2, label: "All Rooms", path: "/rooms" },
  ];

  const isSubmenuActive = (submenuItems) => {
    return submenuItems.some((item) => location.pathname === item.path);
  };

  const [openMenus, setOpenMenus] = useState({
    rooms: isSubmenuActive(roomsSubmenuItems),
  });

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
          flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
          ${
            isActive
              ? "bg-white/20 text-white dark:bg-gray-700/50 dark:text-white"
              : "text-white/80 hover:bg-white/10 dark:hover:bg-gray-700/30"
          }
        `}
      >
        <Icon className="h-5 w-5" />
        <span className="font-medium flex-1">{label}</span>
        {hasSubmenu && (
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${
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
            ? "bg-white/20 text-white dark:bg-gray-700/50"
            : "text-white/70 hover:bg-white/10 dark:hover:bg-gray-700/30"
        }
      `}
    >
      <Icon className="h-4 w-4" />
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );

  return (
    <div className="h-full flex flex-col text-white">
      <div className="p-8">
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          src="/logo_white.png"
          alt="Logo"
          className="h-12 mx-auto filter drop-shadow-xl"
        />
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
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
          <div className="space-y-1">
            <MenuItem
              icon={Building2}
              label="Rooms"
              hasSubmenu
              isActive={isSubmenuActive(roomsSubmenuItems)}
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

        <div className="pt-4 mt-4 border-t border-white/10 dark:border-gray-700/50">
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
        <div className="bg-white/10 dark:bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-sm font-medium">Need Help?</p>
          <p className="text-xs text-white/70 dark:text-gray-300/70 mt-1">
            Check our documentation
          </p>
          <button className="mt-3 w-full px-4 py-2.5 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-medium hover:bg-white/90 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg">
            View Docs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
