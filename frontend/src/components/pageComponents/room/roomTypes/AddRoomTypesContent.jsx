import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { X, Plus, Trash2, Edit2, GitCommit, Check } from "lucide-react";
import { motion } from "framer-motion";
import { createRoomType } from "../../../services/rooms/roomTypeServices";
import { getAllExtraServices } from "../../../services/rooms/extraServiceServices";
import { getAllTimeSlotsExport } from "../../../services/rooms/timeSlotServices";
import { toast } from "react-toastify";
import MultiImageEditor from "../../editors/MultiImageEditor";
import Select from "react-select";
import LoadingSpinner from "../../common/LoadingSpinner";


const AddRoomTypesContent = ({ onClose, onRoomTypeAdded }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    specialPrice: "",
    offerPrice: "",
    maxOccupancy: "",
    extraServices: [],
    timeSlotPricing: [],
    images: [],
    isActive: true,
  });

  const [extraServices, setExtraServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [timeSlotPrice, setTimeSlotPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingSlotIndex, setEditingSlotIndex] = useState(null);
  const [editingPrice, setEditingPrice] = useState("");

  useEffect(() => {
    fetchExtraServices();
    fetchTimeSlots();
  }, []);

  const fetchExtraServices = async () => {
    try {
      const services = await getAllExtraServices();
      setExtraServices(services);
    } catch (error) {
      console.error("Error fetching extra services:", error);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const slots = await getAllTimeSlotsExport();
      if (Array.isArray(slots)) {
        setTimeSlots(slots);
      } else {
        console.error("Fetched time slots is not an array:", slots);
        setTimeSlots([]);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setTimeSlots([]);
    }
  };

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


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleExtraServicesChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      extraServices: selectedOptions.map((option) => option.value),
    }));
  };

const handleAddTimeSlot = () => {
  if (selectedTimeSlot && timeSlotPrice) {
    // Check if the time slot is already added
    const isTimeSlotExists = formData.timeSlotPricing.some(
      (pricing) => pricing.timeSlot === selectedTimeSlot
    );

    if (!isTimeSlotExists) {
      setFormData((prevData) => ({
        ...prevData,
        timeSlotPricing: [
          ...prevData.timeSlotPricing,
          { timeSlot: selectedTimeSlot, price: parseFloat(timeSlotPrice) },
        ],
      }));
      setSelectedTimeSlot("");
      setTimeSlotPrice("");
    } else {
      toast.warning("This time slot has already been added!");
    }
  }
};

  const handleRemoveTimeSlot = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      timeSlotPricing: prevData.timeSlotPricing.filter((_, i) => i !== index),
    }));
  };

const handleImageChange = (processedImages) => {
  setFormData((prevData) => ({
    ...prevData,
    images: processedImages,
  }));
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

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const formDataToSend = new FormData();

  // Add basic form fields
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
    const response = await fetch(image.cropped);
    const blob = await response.blob();
    formDataToSend.append("images", blob, `image-${index}.jpg`);
  });

  try {
    await Promise.all(imagePromises);
    const response = await createRoomType(formDataToSend);
    if (response) {
      toast.success("Room type added successfully!");
      onRoomTypeAdded();
      onClose();
    }
  } catch (error) {
    toast.error(error.message || "Failed to add room type");
    console.error("Error adding room type:", error);
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Add New Room Type</h2>
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
            label="Room Type Name"
            type="text"
            name="name"
            placeholder="Enter room type name"
            value={formData.name}
            onChange={handleInputChange}
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
              onChange={handleExtraServicesChange}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Time Slot Pricing
            </label>

            <div className="flex gap-3 mb-4">
              <Select
                options={
                  Array.isArray(timeSlots)
                    ? timeSlots
                        .filter(
                          (slot) =>
                            !formData.timeSlotPricing.some(
                              (pricing) => pricing.timeSlot === slot._id
                            )
                        )
                        .map((slot) => ({
                          value: slot._id,
                          label: slot.name,
                        }))
                    : []
                }
                value={
                  selectedTimeSlot
                    ? {
                        value: selectedTimeSlot,
                        label: Array.isArray(timeSlots)
                          ? timeSlots.find(
                              (slot) => slot._id === selectedTimeSlot
                            )?.name
                          : "",
                      }
                    : null
                }
                onChange={(selected) => setSelectedTimeSlot(selected?.value)}
                className="react-select-container flex-grow"
                classNamePrefix="react-select"
                placeholder="Select time slot..."
              />
              <input
                type="number"
                value={timeSlotPrice}
                onChange={(e) => setTimeSlotPrice(e.target.value)}
                placeholder="Price"
                className="w-32 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddTimeSlot}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-gray-700 dark:text-gray-200"
                    >
                      Time Slot
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-gray-700 dark:text-gray-200"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-gray-700 dark:text-gray-200"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.timeSlotPricing.map((slot, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                        {timeSlots.find((ts) => ts._id === slot.timeSlot)?.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                        {editingSlotIndex === index ? (
                          <input
                            type="number"
                            value={editingPrice}
                            onChange={(e) => setEditingPrice(e.target.value)}
                            className="w-28 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            className="p-1.5 text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          >
                            <Check size={16} />
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleEditTimeSlot(index, slot.price)
                              }
                              className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveTimeSlot(index)}
                              className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Room Images
            </label>
            <MultiImageEditor
              onImagesChange={handleImageChange}
              maxImages={10}
            />
          </div>

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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add Room Type"}
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
      onChange={(e) => {
        const newValue =
          type === "number" ? parseFloat(e.target.value) : e.target.value;
        onChange({ target: { name, value: newValue } });
      }}
      required={required}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

export default AddRoomTypesContent;
