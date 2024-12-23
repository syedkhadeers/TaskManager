import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { XIcon, Clock, DollarSign } from "lucide-react";

const ViewTimeSlotsContent = ({ timeSlot, onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="h-full w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">View Time Slot</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <XIcon size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <InfoCard
            icon={<Clock className="h-6 w-6" />}
            title="Name"
            value={timeSlot.name}
          />
          <InfoCard
            icon={<Clock className="h-6 w-6" />}
            title="Check-in Time"
            value={timeSlot.checkInTime}
          />
          <InfoCard
            icon={<Clock className="h-6 w-6" />}
            title="Check-out Time"
            value={timeSlot.checkOutTime}
          />
          <InfoCard
            icon={<Clock className="h-6 w-6" />}
            title="Same Day"
            value={timeSlot.sameDay ? "Yes" : "No"}
          />
          <InfoCard
            icon={<DollarSign className="h-6 w-6" />}
            title="Price Multiplier"
            value={timeSlot.priceMultiplier}
          />
          <InfoCard
            icon={<Clock className="h-6 w-6" />}
            title="Status"
            value={
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  timeSlot.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {timeSlot.isActive ? "Active" : "Inactive"}
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, value }) => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-start space-x-4">
    <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">{icon}</div>
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </h3>
      <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
        {value}
      </div>
    </div>
  </div>
);

export default ViewTimeSlotsContent;
