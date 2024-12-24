import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="relative">
        <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
        <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-blue-500 border-t-transparent"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
