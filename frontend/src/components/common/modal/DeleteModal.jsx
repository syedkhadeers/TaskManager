import React from "react";

const DeleteModal = ({  onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-lg bg-white text-gray-900`}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Confirm Delete
        </h2>
        <p className="text-sm mb-6 text-center">
          Are you sure you want to Delete? This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className={`px-5 py-2 text-sm font-medium rounded-md transition-colors bg-gray-200 text-gray-800 hover:bg-gray-300`}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`px-5 py-2 text-sm font-medium rounded-md transition-colors bg-red-600 text-white hover:bg-red-500`}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
