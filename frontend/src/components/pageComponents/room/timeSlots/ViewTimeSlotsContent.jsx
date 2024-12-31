import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  DollarSign,
  Info,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
} from "lucide-react";
import { TimeCard } from "../../../reusables/cards/Cards";

const ViewTimeSlotsContent = ({
  timeSlot,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="relative">
      {/* Top Action Buttons */}
      <div className="absolute top-0 right-0 flex gap-2 p-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(timeSlot)}
          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-300"
        >
          <Edit3 className="h-5 w-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(timeSlot)}
          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-300"
        >
          <Trash2 className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"
          >
            <Clock className="h-12 w-12 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {timeSlot.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Time Slot Details
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleStatus(timeSlot)}
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${
              timeSlot.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {timeSlot.isActive ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            {timeSlot.isActive ? "Active" : "Inactive"}
          </motion.button>
        </div>

        {/* Time Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TimeCard
            title="Check-in"
            value={timeSlot.checkInTime}
            subtitle="Daily check-in"
            icon={<Clock className="h-6 w-6" />}
            color="blue"
          />
          <TimeCard
            title="Check-out"
            value={timeSlot.checkOutTime}
            subtitle="Daily check-out"
            icon={<Clock className="h-6 w-6" />}
            color="purple"
          />
          <TimeCard
            title="Same Day?"
            value={timeSlot.sameDay === "SameDay" ? "Same Day" : "Next Day"}
            subtitle="Booking duration"
            icon={<Calendar className="h-6 w-6" />}
            color="green"
          />
        </div>

        {/* Additional Info Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Additional Details
          </h2>
          <div className="space-y-4">
            <InfoItem
              icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
              label="Price Multiplier"
              value={`${timeSlot.priceMultiplier}x`}
            />
            <InfoItem
              icon={<Clock className="h-5 w-5 text-blue-500" />}
              label="Time Slot Name"
              value={timeSlot.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
};




const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    {icon}
    <span className="text-gray-600 dark:text-gray-400">{label}:</span>
    <span className="font-medium text-gray-900 dark:text-white">{value}</span>
  </div>
);

export default ViewTimeSlotsContent;
