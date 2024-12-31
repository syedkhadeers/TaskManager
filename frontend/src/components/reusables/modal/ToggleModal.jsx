
import React from "react";

const ToggleModal = ({ isActive, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-white text-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Confirm Status Change
        </h2>
        <p className="text-sm mb-6 text-center">
          Are you sure you want to {isActive ? "deactivate" : "activate"} this
          service?
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-5 py-2 text-sm font-medium rounded-md transition-colors bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? "bg-red-600 hover:bg-red-500"
                : "bg-green-600 hover:bg-green-500"
            } text-white`}
            onClick={onConfirm}
          >
            {isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToggleModal;
