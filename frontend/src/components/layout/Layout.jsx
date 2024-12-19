import React, { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Menu } from "lucide-react";
import "../../App.css";

const Layout = ({ children }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`flex h-screen bg-gray-50 ${isDarkMode ? "dark" : ""}`}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 z-30 w-64 transform bg-[#0f172a] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${sidebarOpen ? "" : "hidden lg:block"}
        `}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-h-screen overflow-x-hidden">
        <header className="z-10 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1">
              <Navbar />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
