import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import "../../App.css";

const LayoutAuth = ({ children }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/main_bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: isDarkMode ? "brightness(0.6)" : "brightness(0.9)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-screen-xl mx-auto p-6"
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white/10 dark:bg-gray-900/50 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden"
          style={{
            border: isDarkMode
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {/* Left Side - Branding/Welcome */}
          <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                src="./logo_light.png"
                alt="Logo"
                className="h-16 w-auto filter drop-shadow-[0_0_2px_rgba(255,255,255,0.8)] p-2  mx-auto "
              />

              <h1 className="text-4xl font-bold text-white">
                Welcome to Dashboard
              </h1>

              <p className="text-lg text-white/80">
                Manage your business with our powerful tools
              </p>

              <div className="flex space-x-4">
                <div className="w-12 h-1 bg-white/60 rounded-full" />
                <div className="w-12 h-1 bg-white/30 rounded-full" />
                <div className="w-12 h-1 bg-white/30 rounded-full" />
              </div>
            </motion.div>
          </div>

          {/* Right Side - Auth Content */}
          <div className="p-8 lg:p-12">{children}</div>
        </div>
      </motion.div>
    </div>
  );
};

export default LayoutAuth;
