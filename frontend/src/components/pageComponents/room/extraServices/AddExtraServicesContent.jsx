import React, { useState, useContext } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import { motion } from "framer-motion";
import { createExtraService } from "../../../../services/rooms/extraServiceServices";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../common/LoadingSpinner";
import InputField from "../../../reusables/inputs/InputField";

const AddExtraServicesContent = ({ onClose, onServiceAdded }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
const [formData, setFormData] = useState({
  name: "", // Make sure this matches the backend field name
  description: "",
  basePrice: "",
  icon: "",
  serviceType: "",
  additionalInfo: "",
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
      const response = await createExtraService(formData);
      if (response) {
        toast.success("Extra service added successfully!");
        onServiceAdded && onServiceAdded(response);
        onClose();
      }
    } catch (error) {
      toast.error(error.message || "Failed to add extra service");
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
              label="Service Name"
              type="text"
              name="name"
              placeholder="Enter service name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <InputField
              label="Base Price"
              type="number"
              name="basePrice"
              placeholder="Enter base price"
              value={formData.basePrice}
              onChange={handleInputChange}
              required
            />

            <InputField
              label="Service Type"
              type="text"
              name="serviceType"
              placeholder="Enter service type"
              value={formData.serviceType}
              onChange={handleInputChange}
            />

            <InputField
              label="Icon"
              type="text"
              name="icon"
              placeholder="Enter icon name or class"
              value={formData.icon}
              onChange={handleInputChange}
            />

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                placeholder="Enter additional information"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
            {isLoading ? "Adding..." : "Add Extra Service"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddExtraServicesContent;
