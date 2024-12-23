import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { X, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { createRoomType } from "../../../services/rooms/roomTypeServices";
import { getAllExtraServices } from "../../../services/rooms/extraServiceServices";
import { getAllTimeSlotsExport } from "../../../services/rooms/timeSlotServices";
import { toast } from "react-toastify";
import MultiImageEditor from "../../editors/MultiImageEditor";
import Select from "react-select";

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
      setFormData((prevData) => ({
        ...prevData,
        timeSlotPricing: [
          ...prevData.timeSlotPricing,
          { timeSlot: selectedTimeSlot, price: parseFloat(timeSlotPrice) },
        ],
      }));
      setSelectedTimeSlot("");
      setTimeSlotPrice("");
    }
  };

  const handleRemoveTimeSlot = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      timeSlotPricing: prevData.timeSlotPricing.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (images) => {
    setFormData((prevData) => ({
      ...prevData,
      images,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new FormData object
    const formDataToSend = new FormData();

    // Append all form fields to the FormData object
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((image, index) => {
          // Use the cropped image if available, otherwise use the original file
          const fileToUpload = image.cropped
            ? fetch(image.cropped).then((r) => r.blob())
            : image.file;
          formDataToSend.append(`images`, fileToUpload);
        });
      } else if (key === "extraServices" || key === "timeSlotPricing") {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (
        key === "basePrice" ||
        key === "specialPrice" ||
        key === "offerPrice" ||
        key === "maxOccupancy"
      ) {
        formDataToSend.append(key, formData[key].toString());
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await createRoomType(formDataToSend);
      if (response) {
        toast.success("Room type added successfully!");
        onRoomTypeAdded();
        onClose();
      }
    } catch (error) {
      toast.error(error.message || "Failed to add room type.");
      console.error("Error adding room type:", error);
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

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Time Slot Pricing
            </label>
            <div className="flex space-x-2 mb-2">
              <Select
                options={
                  Array.isArray(timeSlots)
                    ? timeSlots.map((slot) => ({
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
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">
                      {timeSlots.find((ts) => ts._id === slot.timeSlot)?.name}
                    </td>
                    <td className="px-6 py-4">${slot.price}</td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleRemoveTimeSlot(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            className="w-full px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            Add Room Type
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
