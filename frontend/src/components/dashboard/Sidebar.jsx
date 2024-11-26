import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgClose } from "react-icons/cg";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen">
      <aside
        className={`relative flex flex-col w-full p-6 sm:w-60 bg-gray-900 text-white transition-transform duration-300 rounded-2xl ${
          isOpen ? "block" : "hidden lg:block"
        }`}
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-12 w-auto" />

          {/* Divider with Shadow */}
          <div className="w-full h-1 my-4 bg-gray-700 shadow-md rounded-md"></div>
        </div>

        {/* Scrollable Menu Items */}
        <nav className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold tracking-widest uppercase">
              Dashboard
            </h2>
            <div className="flex flex-col space-y-1">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800"
              >
                <LuLayoutDashboard />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800"
              >
                <FaUser />
                <span>Profile</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800"
              >
                <FaCog />
                <span>Settings</span>
              </Link>
              <Link
                to="/logout"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Footer Section */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center mb-4">
          {/* Divider above User Image */}
          <div className="w-full h-1 bg-gray-700 shadow-md rounded-md mb-2"></div>

          <img
            src="/path/to/user-image.jpg"
            alt="User "
            className="h-16 w-16 rounded-full border-2 border-gray-700 mb-2"
          />
          <span className="font-bold">User Name</span>
          <div className="flex space-x-4 mt-2">
            <Link to="/profile" className="p-2 rounded-md hover:bg-gray-800">
              <FaUser />
            </Link>
            <Link to="/lock" className="p-2 rounded-md hover:bg-gray-800">
              <FaCog />
            </Link>
            <Link to="/logout" className="p-2 rounded-md hover:bg-gray-800">
              <FaSignOutAlt />
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden bg-gray-800 mt-4">
        <a
          onClick={toggleSidebar}
          className="bg-gray-900 text-white/50 p-2 lg:hidden rounded-md hover:text-white ml-2"
          href="#"
        >
          {isOpen ? <CgClose /> : <GiHamburgerMenu />}
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
