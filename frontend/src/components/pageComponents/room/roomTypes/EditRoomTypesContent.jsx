import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import { X, Plus, Trash2, Edit2, Check, GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import "../../../../styles/roomStyles.css";
import {
  updateRoomType,
  validateRoomTypeData,
  prepareFormData,
} from "../../../../services/rooms/roomTypeServices";
import { getAllExtraServicesExport } from "../../../../services/rooms/extraServiceServices";
import { getAllTimeSlotsExport } from "../../../../services/rooms/timeSlotServices";
import { toast } from "react-toastify";
import MultiImageEditor from "../../../reusables/editors/MultiImageEditor";
import Select from "react-select";
import LoadingSpinner from "../../../common/LoadingSpinner";
import InputField from "../../../reusables/inputs/InputField";
import "../../../../styles/common.css";

const EditRoomTypesContent = ({ roomType, onClose, onRoomTypeUpdated }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [extraServices, setExtraServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [errors, setErrors] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    name: roomType.name || "",
    description: roomType.description || "",
    basePrice: roomType.basePrice || "",
    specialPrice: roomType.specialPrice || "",
    offerPrice: roomType.offerPrice || "",
    maxOccupancy: roomType.maxOccupancy || 1,
    timeSlotPricing: roomType.timeSlotPricing || [],
    extraServices: roomType.extraServices || [],
    images:
      roomType.images?.map((img) => ({
        url: img.url,
        publicId: img.publicId,
        order: img.order,
        existing: true,
      })) || [],
    isActive: roomType.isActive ?? true,
  });

  // Time Slot Management State
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [timeSlotPrice, setTimeSlotPrice] = useState("");
  const [editingSlotIndex, setEditingSlotIndex] = useState(null);
  const [editingPrice, setEditingPrice] = useState("");

  // Extra Service Management State
  const [selectedExtraService, setSelectedExtraService] = useState(null);
  const [extraServicePrice, setExtraServicePrice] = useState("");
  const [editingServiceIndex, setEditingServiceIndex] = useState(null);
  const [editingServicePrice, setEditingServicePrice] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [servicesData, slotsData] = await Promise.all([
          getAllExtraServicesExport(),
          getAllTimeSlotsExport(),
        ]);
        setExtraServices(servicesData);
        setTimeSlots(slotsData);
      } catch (error) {
        toast.error("Failed to load initial data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue =
      type === "checkbox"
        ? checked
        : type === "number"
        ? parseFloat(value) || 0
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (processedImages) => {
    setFormData((prev) => ({
      ...prev,
      images: processedImages.map((image, index) => ({
        ...image,
        order: index,
      })),
    }));
  };

  // Time Slot Management
  const handleAddTimeSlot = () => {
    if (!selectedTimeSlot || !timeSlotPrice) {
      toast.warning("Please select a time slot and enter price");
      return;
    }

    const exists = formData.timeSlotPricing.some(
      (slot) => slot.timeSlot._id === selectedTimeSlot.value
    );

    if (exists) {
      toast.warning("This time slot is already added");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      timeSlotPricing: [
        ...prev.timeSlotPricing,
        {
          timeSlot: timeSlots.find(
            (slot) => slot._id === selectedTimeSlot.value
          ),
          price: parseFloat(timeSlotPrice),
          order: prev.timeSlotPricing.length,
        },
      ],
    }));

    setSelectedTimeSlot(null);
    setTimeSlotPrice("");
  };

  const handleEditTimeSlot = (index, currentPrice) => {
    setEditingSlotIndex(index);
    setEditingPrice(currentPrice.toString());
  };

  const handleConfirmTimeSlotEdit = (index) => {
    if (!editingPrice || parseFloat(editingPrice) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      timeSlotPricing: prev.timeSlotPricing.map((slot, i) =>
        i === index ? { ...slot, price: parseFloat(editingPrice) } : slot
      ),
    }));

    setEditingSlotIndex(null);
    setEditingPrice("");
  };

  const handleRemoveTimeSlot = (index) => {
    setFormData((prev) => ({
      ...prev,
      timeSlotPricing: prev.timeSlotPricing
        .filter((_, i) => i !== index)
        .map((slot, newIndex) => ({ ...slot, order: newIndex })),
    }));
  };

  // Extra Services Management
  const handleAddExtraService = () => {
    if (!selectedExtraService || !extraServicePrice) {
      toast.warning("Please select an extra service and enter price");
      return;
    }

    const exists = formData.extraServices.some(
      (service) => service.extraServices._id === selectedExtraService.value
    );

    if (exists) {
      toast.warning("This extra service is already added");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      extraServices: [
        ...prev.extraServices,
        {
          extraServices: extraServices.find(
            (service) => service._id === selectedExtraService.value
          ),
          price: parseFloat(extraServicePrice),
          order: prev.extraServices.length,
        },
      ],
    }));

    setSelectedExtraService(null);
    setExtraServicePrice("");
  };

  const handleEditService = (index, currentPrice) => {
    setEditingServiceIndex(index);
    setEditingServicePrice(currentPrice.toString());
  };

  const handleConfirmServiceEdit = (index) => {
    if (!editingServicePrice || parseFloat(editingServicePrice) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      extraServices: prev.extraServices.map((service, i) =>
        i === index
          ? { ...service, price: parseFloat(editingServicePrice) }
          : service
      ),
    }));

    setEditingServiceIndex(null);
    setEditingServicePrice("");
  };

  const handleRemoveService = (index) => {
    setFormData((prev) => ({
      ...prev,
      extraServices: prev.extraServices
        .filter((_, i) => i !== index)
        .map((service, newIndex) => ({ ...service, order: newIndex })),
    }));
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, index, type) => {
    setDraggedItem({ index, type });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index, type) => {
    e.preventDefault();
    if (draggedItem?.type !== type) return;

    const items =
      type === "timeSlot" ? formData.timeSlotPricing : formData.extraServices;
    if (draggedItem.index === index) return;

    const newItems = [...items];
    const draggedItemContent = newItems[draggedItem.index];
    newItems.splice(draggedItem.index, 1);
    newItems.splice(index, 0, draggedItemContent);

    newItems.forEach((item, idx) => {
      item.order = idx;
    });

    setFormData((prev) => ({
      ...prev,
      [type === "timeSlot" ? "timeSlotPricing" : "extraServices"]: newItems,
    }));
    setDraggedItem({ ...draggedItem, index });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validation = validateRoomTypeData(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        toast.error("Please fix the errors before submitting");
        return;
      }

      const preparedData = await prepareFormData(formData);
      await updateRoomType(roomType._id, preparedData);
      toast.success("Room type updated successfully!");
      onRoomTypeUpdated();
    } catch (error) {
      toast.error(error.message || "Failed to update room type");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  // Return JSX with the same structure as AddRoomTypesContent
  // but populated with roomType data
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`min-h-screen ${isDarkMode ? "dark" : ""}`}
    >
      <div className="max-w-7xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header Card */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField
                label="Room Type Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                required
                className="transform hover:scale-[1.02] transition-all duration-200"
              />
              <InputField
                label="Max Occupancy"
                type="number"
                name="maxOccupancy"
                value={formData.maxOccupancy}
                onChange={handleInputChange}
                error={errors.maxOccupancy}
                required
                min="1"
                className="transform hover:scale-[1.02] transition-all duration-200"
              />
            </div>
          </div>

          {/* Pricing Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <InputField
                label="Base Price"
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleInputChange}
                error={errors.basePrice}
                required
                min="0"
                step="0.01"
                prefix="$"
                className="glass-input"
              />
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <InputField
                label="Offer Price"
                type="number"
                name="offerPrice"
                value={formData.offerPrice}
                onChange={handleInputChange}
                error={errors.offerPrice}
                min="0"
                step="0.01"
                prefix="$"
                className="glass-input"
              />
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <InputField
                label="Special Price"
                type="number"
                name="specialPrice"
                value={formData.specialPrice}
                onChange={handleInputChange}
                error={errors.specialPrice}
                min="0"
                step="0.01"
                prefix="$"
                className="glass-input"
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="relative bg-white/90 dark:bg-gray-800/90 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
            <label className="absolute -top-3 left-4 bg-white dark:bg-gray-800 px-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 rounded-xl border-0 bg-transparent focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          {/* Time Slots and Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Time Slots Section */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-lg">
              <div className="space-y-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Time Slot Pricing
                </h3>
                <div className="flex items-center gap-4">
                  <Select
                    value={selectedTimeSlot}
                    onChange={setSelectedTimeSlot}
                    options={timeSlots
                      .filter(
                        (slot) =>
                          !formData.timeSlotPricing.some(
                            (p) => p.timeSlot._id === slot._id
                          )
                      )
                      .map((slot) => ({
                        value: slot._id,
                        label: slot.name,
                      }))}
                    className="flex-grow select-container"
                    classNamePrefix="select"
                    placeholder="Select time slot..."
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        minHeight: "3rem",
                        backgroundColor: isDarkMode ? "#1f2937" : "white",
                        borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                      }),
                    }}
                  />
                  <input
                    type="number"
                    value={timeSlotPrice}
                    onChange={(e) => setTimeSlotPrice(e.target.value)}
                    placeholder="Price"
                    className="w-24 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    min="0"
                    step="0.01"
                  />
                  <button
                    type="button"
                    onClick={handleAddTimeSlot}
                    className="p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Time Slots List */}
                <div className="mt-6 space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                  {formData.timeSlotPricing.map((slot, index) => (
                    <div
                      key={`timeSlot-${index}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index, "timeSlot")}
                      onDragOver={(e) => handleDragOver(e, index, "timeSlot")}
                      className="group flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 cursor-move"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="text-gray-400" size={16} />
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          {index + 1}.
                        </span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {slot.timeSlot.name}
                        </span>
                        {editingSlotIndex === index ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editingPrice}
                              onChange={(e) => setEditingPrice(e.target.value)}
                              className="w-24 px-3 py-1.5 rounded-lg border"
                              min="0"
                              step="0.01"
                            />
                            <button
                              type="button"
                              onClick={() => handleConfirmTimeSlotEdit(index)}
                              className="p-1.5 text-green-500 hover:text-green-600"
                            >
                              <Check size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-600 dark:text-gray-300 font-medium">
                            ${slot.price}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {editingSlotIndex !== index && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleEditTimeSlot(index, slot.price)
                              }
                              className="p-1.5 text-blue-500 hover:text-blue-600"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveTimeSlot(index)}
                              className="p-1.5 text-red-500 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Extra Services Section */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-lg">
              <div className="space-y-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Extra Services
                </h3>
                <div className="flex items-center gap-4">
                  <Select
                    value={selectedExtraService}
                    onChange={setSelectedExtraService}
                    options={extraServices
                      .filter(
                        (service) =>
                          !formData.extraServices.some(
                            (p) => p.extraServices._id === service._id
                          )
                      )
                      .map((service) => ({
                        value: service._id,
                        label: service.name,
                      }))}
                    className="flex-grow select-container"
                    classNamePrefix="select"
                    placeholder="Select extra service..."
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        minHeight: "3rem",
                        backgroundColor: isDarkMode ? "#1f2937" : "white",
                        borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                      }),
                    }}
                  />
                  <input
                    type="number"
                    value={extraServicePrice}
                    onChange={(e) => setExtraServicePrice(e.target.value)}
                    placeholder="Price"
                    className="w-24 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    min="0"
                    step="0.01"
                  />
                  <button
                    type="button"
                    onClick={handleAddExtraService}
                    className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Extra Services List */}
                <div className="mt-6 space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                  {formData.extraServices.map((service, index) => (
                    <div
                      key={`service-${index}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index, "service")}
                      onDragOver={(e) => handleDragOver(e, index, "service")}
                      className="group flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 cursor-move"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="text-gray-400" size={16} />
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          {index + 1}.
                        </span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {service.extraServices.name}
                        </span>
                        {editingServiceIndex === index ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editingServicePrice}
                              onChange={(e) =>
                                setEditingServicePrice(e.target.value)
                              }
                              className="w-24 px-3 py-1.5 rounded-lg border"
                              min="0"
                              step="0.01"
                            />
                            <button
                              type="button"
                              onClick={() => handleConfirmServiceEdit(index)}
                              className="p-1.5 text-green-500 hover:text-green-600"
                            >
                              <Check size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-600 dark:text-gray-300 font-medium">
                            ${service.price}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {editingServiceIndex !== index && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleEditService(index, service.price)
                              }
                              className="p-1.5 text-purple-500 hover:text-purple-600"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveService(index)}
                              className="p-1.5 text-red-500 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white/95 dark:bg-gray-800/95 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <MultiImageEditor
              onImagesChange={handleImageChange}
              maxImages={10}
              initialImages={formData.images.map((img) => ({
                preview: img.url,
                publicId: img.publicId,
                order: img.order,
              }))}
              className="image-gallery-modern"
            />
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Room Type"
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditRoomTypesContent;
