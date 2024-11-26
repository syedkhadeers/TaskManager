import React from "react";

const DashboardContent = () => {
  return (
    <div className="flex-1 px-2 sm:px-0">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-extralight text-white/50">Groups</h3>
        <div className="inline-flex items-center space-x-2">
          {/* Add any additional controls here */}
        </div>
      </div>
      <div className="mb-10 sm:mb-0 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* Ensure your group cards are responsive */}
        <div className="bg-gray-700 p-4 rounded-lg">Group 1</div>
        <div className="bg-gray-700 p-4 rounded-lg">Group 2</div>
        <div className="bg-gray-700 p-4 rounded-lg">Group 3</div>
        <div className="bg-gray-700 p-4 rounded-lg">Group 4</div>
        {/* Add more group cards as needed */}
      </div>
    </div>
  );
};

export default DashboardContent;
