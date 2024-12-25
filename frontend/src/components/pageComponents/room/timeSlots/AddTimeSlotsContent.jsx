import React, { useState, useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { FiClock, FiCalendar, FiDollarSign } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { createTimeSlot } from "../../../services/rooms/timeSlotServices";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const AddTimeSlotsContent = ({ onClose, onTimeSlotAdded }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    checkInTime: "",
    checkOutTime: "",
    sameDay: "Same Day",
    priceMultiplier: 1,
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createTimeSlot(formData);
      if (response) {
        toast.success("Time slot added successfully!");
        onTimeSlotAdded();
        onClose();
        navigate("/time-slots");
      }
    } catch (error) {
      toast.error("Failed to add time slot.");
      console.error("Error adding time slot:", error);
    }
  };

  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className={`h-full ${isDarkMode ? "dark" : ""}`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Add New Time Slot</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="p-6 overflow-y-auto max-h-[calc(100vh-80px)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Name"
            icon={<FiClock />}
            type="text"
            name="name"
            placeholder="Enter time slot name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <InputField
            label="Check-in Time"
            icon={<FiClock />}
            type="time"
            name="checkInTime"
            value={formData.checkInTime}
            onChange={handleChange}
            required
          />

          <InputField
            label="Check-out Time"
            icon={<FiClock />}
            type="time"
            name="checkOutTime"
            value={formData.checkOutTime}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Same Day
            </label>
            <select
              name="sameDay"
              value={formData.sameDay}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Same Day">Same Day</option>
              <option value="Next Day">Next Day</option>
            </select>
          </div>

          <InputField
            label="Price Multiplier"
            icon={<FiDollarSign />}
            type="number"
            name="priceMultiplier"
            placeholder="Enter price multiplier"
            value={formData.priceMultiplier}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 mr-2"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Active
            </label>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            Add Time Slot
          </button>
        </form>
      </div>
    </motion.div>
  );
};

const InputField = ({
  label,
  icon,
  type,
  name,
  placeholder,
  value,
  onChange,
  required,
  step,
  min,
}) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        step={step}
        min={min}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  </div>
);

export default AddTimeSlotsContent;
