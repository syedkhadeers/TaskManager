import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { updateExtraService } from "../../../../services/rooms/extraServiceServices";
import { toast } from "react-toastify";
import ImageEditor from "../../../reusables/editors/ImageEditor";

const EditExtraServicesContent = ({ service, onClose, onServiceUpdated }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const initialFormState = {
    serviceName: "",
    description: "",
    price: "",
    serviceType: "",
    isAvailable: true,
    image: null,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (service) {
      setFormData({
        serviceName: service.serviceName || "",
        description: service.description || "",
        price: service.price || "",
        serviceType: service.serviceType || "",
        isAvailable: Boolean(service.isAvailable),
        image: service.image || null,
      });

      if (service.image) {
        setImagePreview(service.image);
      }
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleCropComplete = (croppedImageUrl) => {
    if (!croppedImageUrl) return;

    setImagePreview(croppedImageUrl);
    setFormData((prev) => ({
      ...prev,
      image: croppedImageUrl,
    }));
  };

  const handleCropCancel = () => {
    setFormData((prev) => ({
      ...prev,
      image: service?.image || null,
    }));
    setImagePreview(service?.image || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = { ...formData };

      // Only process image if it's new or changed
      if (formData.image && formData.image !== service?.image) {
        try {
          const response = await fetch(formData.image);
          const blob = await response.blob();
          dataToSend.image = new File([blob], "service_image.jpg", {
            type: "image/jpeg",
          });
        } catch (error) {
          console.error("Error processing image:", error);
          toast.error("Failed to process image. Please try again.");
          return;
        }
      }

      // Validate required fields
      if (!dataToSend.serviceName || !dataToSend.price) {
        toast.error("Please fill in all required fields");
        return;
      }

      await updateExtraService(service._id, dataToSend);
      toast.success("Extra service updated successfully!");
      onServiceUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating extra service:", error);
      toast.error(error.message || "Failed to update extra service.");
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
          <h2 className="text-2xl font-bold text-white">Edit Extra Service</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
            type="button"
            aria-label="Close"
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
            onChange={handleChange}
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
              onChange={handleChange}
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
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />

          <InputField
            label="Service Type"
            type="text"
            name="serviceType"
            placeholder="Enter Service Type"
            value={formData.serviceType}
            onChange={handleChange}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
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
              onCropComplete={handleCropComplete}
              onCancel={handleCropCancel}
              modalTitle="Edit Service Image"
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
            Update Extra Service
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
  min,
  step,
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
      min={min}
      step={step}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

export default EditExtraServicesContent;
