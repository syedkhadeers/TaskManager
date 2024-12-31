import React, { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";

const Layout = ({ children }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-20 bg-black/60 dark:bg-black/80 backdrop-blur-md lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          width: sidebarOpen ? "280px" : "0px",
          opacity: sidebarOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-y-0 left-0 z-30 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 shadow-2xl dark:shadow-gray-900/50 lg:relative rounded-r-2xl"
      >
        <Sidebar isOpen={sidebarOpen} />
      </motion.div>

      <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-[1600px] w-full mx-auto px-6 py-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
