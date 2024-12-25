import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { FiUser, FiMail, FiPhone, FiGlobe } from "react-icons/fi";
import {  updateUserById } from "../../../services/user/userServices";
import { toast } from "react-toastify";
import ImageEditor from "../../reusables/editors/ImageEditor";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const EditUsersContent = ({ user, onClose, onUserUpdated }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    country: "",
    email: "",
    photo: null,
    bio: "",
    role: "user",
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        mobile: user.mobile || "",
        country: user.country || "",
        email: user.email || "",
        bio: user.bio || "",
        role: user.role || "user",
      });
      if (user.photo?.url) {
        setImagePreview(user.photo.url);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCropComplete = (croppedImageUrl) => {
    setImagePreview(croppedImageUrl);
    setFormData((prev) => ({
      ...prev,
      photo: croppedImageUrl,
    }));
  };

  const handleCropCancel = () => {
    setFormData((prev) => ({
      ...prev,
      photo: null,
    }));
    setImagePreview(user?.photo?.url || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = { ...formData };

      if (formData.photo && formData.photo !== user?.photo?.url) {
        const response = await fetch(formData.photo);
        const blob = await response.blob();
        dataToSend.photo = new File([blob], "profile.jpg", {
          type: "image/jpeg",
        });
      }

      await updateUserById(user._id, dataToSend);
      toast.success("User updated successfully!");
      onUserUpdated();
      onClose();
    } catch (error) {
      toast.error("Failed to update user.");
      console.error("Error updating user:", error);
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
          <h2 className="text-2xl font-bold text-white">Edit User</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Name"
              icon={<FiUser />}
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <InputField
              label="Email"
              icon={<FiMail />}
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputField
              label="Mobile"
              icon={<FiPhone />}
              type="text"
              name="mobile"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleChange}
            />

            <InputField
              label="Country"
              icon={<FiGlobe />}
              type="text"
              name="country"
              placeholder="Enter country"
              value={formData.country}
              onChange={handleChange}
            />

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="creator">Creator</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Bio
            </label>
            <textarea
              name="bio"
              placeholder="Enter bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Profile Photo
            </label>
            <ImageEditor
              onCropComplete={handleCropComplete}
              onCancel={handleCropCancel}
              modalTitle="Edit Profile Photo"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="h-24 w-24 rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            Update User
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
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  </div>
);

export default EditUsersContent;
