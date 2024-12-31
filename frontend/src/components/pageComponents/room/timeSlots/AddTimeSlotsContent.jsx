import React, { useState, useContext } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import { motion } from "framer-motion";
import { createTimeSlot } from "../../../../services/rooms/timeSlotServices";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../common/LoadingSpinner";
import InputField from "../../../reusables/inputs/InputField";

const AddTimeSlotsContent = ({ onClose, onTimeSlotAdded }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    checkInTime: "",
    checkOutTime: "",
    sameDay: "SameDay",
    priceMultiplier: 1,
    isActive: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await createTimeSlot(formData);
      if (response) {
        toast.success("Time slot added successfully!");
        onTimeSlotAdded && onTimeSlotAdded(response);
        onClose();
      }
    } catch (error) {
      toast.error(error.message || "Failed to add time slot");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className={`h-full ${isDarkMode ? "dark" : ""}`}
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Time Slot Name"
              type="text"
              name="name"
              placeholder="Enter time slot name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <InputField
              label="Check-in Time"
              type="time"
              name="checkInTime"
              value={formData.checkInTime}
              onChange={handleInputChange}
              required
            />

            <InputField
              label="Check-out Time"
              type="time"
              name="checkOutTime"
              value={formData.checkOutTime}
              onChange={handleInputChange}
              required
            />

            <InputField
              label="Price Multiplier"
              type="number"
              name="priceMultiplier"
              placeholder="Enter price multiplier"
              value={formData.priceMultiplier}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
            />

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                Day Type
              </label>
              <select
                name="sameDay"
                value={formData.sameDay}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="SameDay">Same Day</option>
                <option value="NextDay">Next Day</option>
              </select>
            </div>

            <div className="col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="mr-2 rounded text-blue-500 dark:bg-gray-600 focus:ring-blue-400"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm text-gray-700 dark:text-gray-200"
                >
                  Is Active
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add Time Slot"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddTimeSlotsContent;
