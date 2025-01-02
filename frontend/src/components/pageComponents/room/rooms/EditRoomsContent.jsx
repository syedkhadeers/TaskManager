import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import MultiImageEditor from "../../../reusables/editors/MultiImageEditor";
import Select from "react-select";
import LoadingSpinner from "../../../common/LoadingSpinner";
import InputField from "../../../reusables/inputs/InputField";
import {
  updateRoom,
  validateRoomData,
  getRoomById,
} from "../../../../services/rooms/roomsServices";
import { getAllRoomTypes } from "../../../../services/rooms/roomTypeServices";

const EditRoomsContent = ({ roomId, onClose, onSuccess }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(true);
  const [roomTypes, setRoomTypes] = useState([]);
  const [errors, setErrors] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "",
    floor: "",
    description: "",
    amenities: [],
    smokingAllowed: false,
    petsAllowed: false,
    status: "available",
    images: [],
    isActive: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomTypesResponse, roomResponse] = await Promise.all([
          getAllRoomTypes(),
          getRoomById(roomId),
        ]);

        setRoomTypes(roomTypesResponse || []);

        // Transform existing images to match MultiImageEditor format
        const transformedImages = roomResponse.images.map((image, index) => ({
          preview: image.url,
          cropped: image.url,
          publicId: image.publicId,
          order: image.order || index,
          existing: true, // Flag to identify existing images
        }));

        setFormData({
          roomNumber: roomResponse.roomNumber,
          roomType: roomResponse.roomType._id,
          floor: roomResponse.floor,
          description: roomResponse.description || "",
          amenities: roomResponse.amenities || [],
          smokingAllowed: roomResponse.smokingAllowed,
          petsAllowed: roomResponse.petsAllowed,
          status: roomResponse.status,
          images: transformedImages,
          isActive: roomResponse.isActive,
        });
      } catch (error) {
        toast.error("Failed to fetch room data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [roomId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption.value,
    }));
  };

  const handleAmenitiesChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      amenities: selectedOptions.map((option) => option.value),
    }));
  };

  const handleImageChange = (processedImages) => {
    setFormData((prev) => ({
      ...prev,
      images: processedImages.map((image, index) => ({
        ...image,
        order: index,
        existing: image.existing || false,
      })),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validation = validateRoomData(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        toast.error("Please fix the form errors");
        return;
      }

      await updateRoom(roomId, formData);
      toast.success("Room updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to update room");
    } finally {
      setIsLoading(false);
    }
  };

  const amenityOptions = [
    { value: "wifi", label: "WiFi" },
    { value: "tv", label: "TV" },
    { value: "ac", label: "Air Conditioning" },
    { value: "minibar", label: "Mini Bar" },
    { value: "safe", label: "Safe" },
    { value: "desk", label: "Work Desk" },
  ];

  const statusOptions = [
    { value: "available", label: "Available" },
    { value: "occupied", label: "Occupied" },
    { value: "maintenance", label: "Maintenance" },
    { value: "reserved", label: "Reserved" },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`min-h-screen ${isDarkMode ? "dark" : ""}`}
    >
      <div className="max-w-7xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Edit Room
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InputField
                  label="Room Number"
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  error={errors.roomNumber}
                  required
                  className="transform hover:scale-[1.01] transition-all duration-200"
                />

                <InputField
                  label="Floor"
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  error={errors.floor}
                  required
                  className="transform hover:scale-[1.01] transition-all duration-200"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Room Type
                  </label>
                  <Select
                    name="roomType"
                    options={roomTypes.map((type) => ({
                      value: type._id,
                      label: type.name,
                    }))}
                    value={roomTypes
                      .map((type) => ({
                        value: type._id,
                        label: type.name,
                      }))
                      .find((option) => option.value === formData.roomType)}
                    onChange={(option) =>
                      handleSelectChange(option, { name: "roomType" })
                    }
                    placeholder="Select Room Type"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "2.75rem",
                        background: isDarkMode ? "#1f2937" : "white",
                        borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                        "&:hover": {
                          borderColor: "#3b82f6",
                        },
                      }),
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Room Status
                  </label>
                  <Select
                    name="status"
                    options={statusOptions}
                    value={statusOptions.find(
                      (option) => option.value === formData.status
                    )}
                    onChange={(option) =>
                      handleSelectChange(option, { name: "status" })
                    }
                    placeholder="Select Status"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "2.75rem",
                        background: isDarkMode ? "#1f2937" : "white",
                        borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                        "&:hover": {
                          borderColor: "#3b82f6",
                        },
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features and Amenities Section */}
          <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Features & Amenities
            </h3>
            <div className="space-y-6">
              <Select
                isMulti
                name="amenities"
                options={amenityOptions}
                value={amenityOptions.filter((option) =>
                  formData.amenities.includes(option.value)
                )}
                onChange={handleAmenitiesChange}
                placeholder="Select Amenities"
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "2.75rem",
                    background: isDarkMode ? "#1f2937" : "white",
                    borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                    "&:hover": {
                      borderColor: "#8b5cf6",
                    },
                  }),
                }}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="smokingAllowed"
                      checked={formData.smokingAllowed}
                      onChange={handleInputChange}
                      className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      Smoking Allowed
                    </span>
                  </label>
                </div>

                <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="petsAllowed"
                      checked={formData.petsAllowed}
                      onChange={handleInputChange}
                      className="form-checkbox h-5 w-5 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
                    />
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      Pets Allowed
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Room Description
            </h3>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter detailed room description..."
              rows="4"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Images Section */}
          <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Room Images
            </h3>
            <MultiImageEditor
              onImagesChange={handleImageChange}
              maxImages={10}
              initialImages={formData.images}
              className="image-gallery-modern"
            />
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/50 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
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
                "Update Room"
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditRoomsContent;

