import React from "react";

const LogoutModal = ({ isDarkMode, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Confirm Logout
        </h2>
        <p className="text-sm mb-6 text-center">
          Are you sure you want to log out? Make sure to save your work before
          proceeding.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${
              isDarkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${
              isDarkMode
                ? "bg-red-600 text-white hover:bg-red-500"
                : "bg-red-500 text-white hover:bg-red-400"
            }`}
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
