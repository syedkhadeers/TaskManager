import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { X, Plus, Trash2, Check, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { updateRoomType } from "../../../services/rooms/roomTypeServices";
import { getAllExtraServices } from "../../../services/rooms/extraServiceServices";
import { getAllTimeSlotsExport } from "../../../services/rooms/timeSlotServices";
import { toast } from "react-toastify";
import MultiImageEditor from "../../editors/MultiImageEditor";
import Select from "react-select";
import LoadingSpinner from "../../common/LoadingSpinner";

const EditRoomTypesContent = ({ roomType, onClose, onRoomTypeUpdated }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    name: roomType.name || "",
    description: roomType.description || "",
    basePrice: roomType.basePrice || 0,
    specialPrice: roomType.specialPrice || 0,
    offerPrice: roomType.offerPrice || 0,
    maxOccupancy: roomType.maxOccupancy || 1,
    extraServices: roomType.extraServices || [],
    timeSlotPricing: roomType.timeSlotPricing || [],
    images: roomType.images?.map((url) => ({ preview: url })) || [],
    isActive: roomType.isActive ?? true,
  });

  const [extraServices, setExtraServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [timeSlotPrice, setTimeSlotPrice] = useState("");
  const [editingSlotIndex, setEditingSlotIndex] = useState(null);
  const [editingPrice, setEditingPrice] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [services, slots] = await Promise.all([
          getAllExtraServices(),
          getAllTimeSlotsExport(),
        ]);
        setExtraServices(services);
        setTimeSlots(slots);

      } catch (error) {
        toast.error("Error loading initial data");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);
  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.basePrice) errors.basePrice = "Base price is required";
    if (!formData.maxOccupancy)
      errors.maxOccupancy = "Max occupancy is required";
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleEditTimeSlot = (index, currentPrice) => {
    setEditingSlotIndex(index);
    setEditingPrice(currentPrice.toString());
  };

  const handleConfirmEdit = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      timeSlotPricing: prevData.timeSlotPricing.map((slot, i) => {
        if (i === index) {
          return { ...slot, price: parseFloat(editingPrice) };
        }
        return slot;
      }),
    }));
    setEditingSlotIndex(null);
    setEditingPrice("");
  };


  const handleExtraServicesChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      extraServices: selectedOptions.map((option) => option.value),
    }));
  };

  const handleAddTimeSlot = () => {
    if (!selectedTimeSlot || !timeSlotPrice) {
      toast.warning("Please select a time slot and enter a price");
      return;
    }

    const timeSlotExists = formData.timeSlotPricing.some(
      (slot) => (slot.timeSlot._id || slot.timeSlot) === selectedTimeSlot
    );

    if (timeSlotExists) {
      toast.warning("This time slot already exists");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      timeSlotPricing: [
        ...prev.timeSlotPricing,
        { timeSlot: selectedTimeSlot, price: parseFloat(timeSlotPrice) },
      ],
    }));

    setSelectedTimeSlot("");
    setTimeSlotPrice("");
  };

  const handleRemoveTimeSlot = (index) => {
    setFormData((prev) => ({
      ...prev,
      timeSlotPricing: prev.timeSlotPricing.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (images) => {
    setFormData((prev) => ({ ...prev, images }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();

    // Add basic fields
    Object.keys(formData).forEach((key) => {
      if (
        key !== "images" &&
        key !== "extraServices" &&
        key !== "timeSlotPricing"
      ) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Add arrays as JSON strings
    formDataToSend.append(
      "extraServices",
      JSON.stringify(formData.extraServices)
    );
    formDataToSend.append(
      "timeSlotPricing",
      JSON.stringify(formData.timeSlotPricing)
    );

    // Handle images
    const imagePromises = formData.images.map(async (image, index) => {
      if (image.file) {
        formDataToSend.append("images", image.file);
      } else if (image.preview && !image.file) {
        try {
          const response = await fetch(image.preview);
          const blob = await response.blob();
          formDataToSend.append("images", blob, `image-${index}.jpg`);
        } catch (error) {
          console.error("Error processing image:", error);
        }
      }
    });

    try {
      await Promise.all(imagePromises);
      const response = await updateRoomType(roomType._id, formDataToSend);

      if (response) {
        toast.success("Room type updated successfully!");
        onRoomTypeUpdated();
        onClose();
      }
    } catch (error) {
      toast.error(error.message || "Failed to update room type");
      console.error("Error updating room type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

const getTimeSlotName = (timeSlotId) => {

  const timeSlot = timeSlots.find((ts) => {
    return String(ts._id || ts.id) === String(timeSlotId);
  });

  return timeSlot?.name || `Unknown Slot`;
};

  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className={`h-full ${isDarkMode ? "dark" : ""}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Edit Room Type</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(100vh-80px)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields */}
          <InputField
            label="Room Type Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter room type description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Price Fields */}
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
            label="Special Price"
            type="number"
            name="specialPrice"
            placeholder="Enter special price"
            value={formData.specialPrice}
            onChange={handleInputChange}
          />

          <InputField
            label="Offer Price"
            type="number"
            name="offerPrice"
            placeholder="Enter offer price"
            value={formData.offerPrice}
            onChange={handleInputChange}
          />

          <InputField
            label="Max Occupancy"
            type="number"
            name="maxOccupancy"
            placeholder="Enter max occupancy"
            value={formData.maxOccupancy}
            onChange={handleInputChange}
            required
          />

          {/* Extra Services Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Extra Services
            </label>
            <Select
              isMulti
              options={extraServices.map((service) => ({
                value: service._id,
                label: service.serviceName,
              }))}
              value={formData.extraServices
                .map((serviceId) => {
                  const matchingService = extraServices.find(
                    (service) => service._id === serviceId
                  );
                  return matchingService
                    ? {
                        value: matchingService._id,
                        label: matchingService.serviceName,
                      }
                    : null;
                })
                .filter(Boolean)} // This removes any null/undefined values
              onChange={handleExtraServicesChange}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Time Slot Pricing */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Time Slot Pricing
            </label>
            <div className="flex space-x-2 mb-2">
              <Select
                options={timeSlots
                  .filter(
                    (slot) =>
                      !formData.timeSlotPricing.some(
                        (pricing) =>
                          (pricing.timeSlot._id || pricing.timeSlot) ===
                          (slot._id || slot.id)
                      )
                  )
                  .map((slot) => ({
                    value: slot._id || slot.id,
                    label: slot.name,
                  }))}
                value={
                  selectedTimeSlot
                    ? {
                        value: selectedTimeSlot,
                        label: timeSlots.find(
                          (slot) => (slot._id || slot.id) === selectedTimeSlot
                        )?.name,
                      }
                    : null
                }
                onChange={(selected) => setSelectedTimeSlot(selected?.value)}
                className="react-select-container flex-grow"
                classNamePrefix="react-select"
              />
              <input
                type="number"
                value={timeSlotPrice}
                onChange={(e) => setTimeSlotPrice(e.target.value)}
                placeholder="Price"
                className="w-24 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddTimeSlot}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <Plus size={20} />
              </button>
            </div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Time Slot
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.timeSlotPricing.map((slot, index) => (
                  <tr
                    key={`${slot.timeSlot}-${index}`}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">
                      {getTimeSlotName(slot.timeSlot._id || slot.timeSlot)}
                    </td>
                    <td className="px-6 py-4">
                      {editingSlotIndex === index ? (
                        <input
                          type="number"
                          value={editingPrice}
                          onChange={(e) => setEditingPrice(e.target.value)}
                          className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        />
                      ) : (
                        `$${slot.price}`
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingSlotIndex === index ? (
                        <button
                          type="button"
                          onClick={() => handleConfirmEdit(index)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <Check size={16} />
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEditTimeSlot(index, slot.price)
                            }
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveTimeSlot(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Active Status */}
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

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Room Images
            </label>
            <MultiImageEditor
              onImagesChange={handleImageChange}
              maxImages={10}
              initialImages={formData.images.map((image) => ({
                preview: typeof image === "string" ? image : image.preview,
              }))}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Room Type"}
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

export default EditRoomTypesContent;
