import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { FiUser, FiMail, FiPhone, FiGlobe } from "react-icons/fi";
import { updateOtherUser } from "../../services/userServices";
import { toast } from "react-toastify";
import ImageEditor from "../editors/ImageEditor";

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

      await updateOtherUser(user._id, dataToSend);
      toast.success("User updated successfully!");
      onUserUpdated();
      onClose();
    } catch (error) {
      toast.error("Failed to update user.");
      console.error("Error updating user:", error);
    }
  };

  return (
    <div
      className={`p-6 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Edit User</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Regular form fields */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <InputField
            icon={<FiUser />}
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <InputField
            icon={<FiMail />}
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mobile</label>
          <InputField
            icon={<FiPhone />}
            type="text"
            name="mobile"
            placeholder="Enter mobile number"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <InputField
            icon={<FiGlobe />}
            type="text"
            name="country"
            placeholder="Enter country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            placeholder="Enter bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="creator">Creator</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Profile Photo
          </label>
          <ImageEditor
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
            aspectRatios={[{ label: "Free Cropping", value: null }]}
            modalTitle="Edit Profile Photo"
          />
          {imagePreview && (
            <div className="mt-4">
              <h4 className="text-sm font-medium">Current Photo:</h4>
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="h-24 w-24 border rounded-lg mt-2 object-cover"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Update User
        </button>
      </form>
    </div>
  );
};

const InputField = ({
  icon,
  type,
  name,
  placeholder,
  value,
  onChange,
  required,
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
      required={required}
    />
  </div>
);

export default EditUsersContent;
