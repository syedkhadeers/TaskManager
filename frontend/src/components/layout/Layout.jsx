import React, { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Layout = ({ children }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`flex h-screen bg-gray-50 ${isDarkMode ? "dark" : ""}`}>
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          width: sidebarOpen ? "280px" : "0px",
          opacity: sidebarOpen ? 1 : 0,
        }}
        className="fixed inset-y-0 left-0 z-30 bg-gradient-to-br from-blue-600 via-purple-600 to-violet-600 shadow-2xl lg:relative"
      >
        <Sidebar isOpen={sidebarOpen} />
      </motion.div>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-6 py-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
