import React from "react";
import { motion } from "framer-motion";
import { LogOut, AlertCircle } from "lucide-react";

const LogoutModal = ({ isDarkMode, onCancel, onConfirm }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full max-w-md overflow-hidden rounded-2xl shadow-xl ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div
              className={`p-3 rounded-full ${
                isDarkMode ? "bg-red-500/10" : "bg-red-50"
              }`}
            >
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>

          <h2
            className={`text-xl font-semibold text-center mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Confirm Logout
          </h2>

          <p
            className={`text-sm text-center mb-6 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Are you sure you want to log out? Any unsaved changes will be lost.
          </p>

          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LogoutModal;
