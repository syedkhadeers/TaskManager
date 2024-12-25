import React, { useState, useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { createExtraService } from "../../../services/rooms/extraServiceServices";
import { toast } from "react-toastify";
import ImageEditor from "../../editors/ImageEditor";

const AddExtraServicesContent = ({ onClose, onServiceAdded }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    price: "",
    serviceType: "",
    isAvailable: true,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageCropComplete = async (croppedImageUrl) => {
    try {
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const imageFile = new File([blob], "service_image.jpg", {
        type: "image/jpeg",
      });

      setImagePreview(croppedImageUrl);
      setFormData((prev) => ({
        ...prev,
        image: imageFile,
      }));
    } catch (error) {
      toast.error("Error processing image");
      console.error("Error processing image:", error);
    }
  };

  const handleImageCropCancel = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createExtraService(formData);
      if (response) {
        toast.success("Extra service added successfully!");
        onServiceAdded();
        onClose();
      }
    } catch (error) {
      toast.error("Failed to add extra service.");
      console.error("Error adding extra service:", error);
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
          <h2 className="text-2xl font-bold text-white">
            Add New Extra Service
          </h2>
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
            label="Service Name"
            type="text"
            name="serviceName"
            placeholder="Enter service name"
            value={formData.serviceName}
            onChange={handleInputChange}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter service description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <InputField
            label="Price"
            type="number"
            name="price"
            placeholder="Enter price"
            value={formData.price}
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

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleInputChange}
              className="mr-2 rounded text-blue-500 dark:bg-gray-600 focus:ring-blue-400"
            />
            <label
              htmlFor="isAvailable"
              className="text-sm text-gray-700 dark:text-gray-200"
            >
              Is Available
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Service Image
            </label>
            <ImageEditor
              onCropComplete={handleImageCropComplete}
              onCancel={handleImageCropCancel}
              modalTitle="Crop Service Image"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Service Preview"
                  className="h-24 w-24 rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            Add Extra Service
          </button>
        </form>
      </div>
    </motion.div>
  );
};

const InputField = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  required,
}) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
      {label}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

export default AddExtraServicesContent;
