import React, { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { FiUser, FiMail, FiPhone, FiLock, FiGlobe } from "react-icons/fi";
import { MdAddPhotoAlternate } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../services/authService";
import CustomCropAspect from "../common/formElements/intermediate/CustomCropAspect";

const AddUsersContent = ({ onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    country: "",
    email: "",
    password: "",
    photo: null,
    bio: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await addUser(formData);
    if (response) {
      onClose();
      // Optionally, you can refresh the user list or show a success message
    }
  };

  return (
    <div
      className={`p-6 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Add User</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
          <label className="block text-sm font-medium mb-1">Phone</label>
          <InputField
            icon={<FiPhone />}
            type="text"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
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
          <label className="block text-sm font-medium mb-1">Password</label>
          <InputField
            icon={<FiLock />}
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Profile Photo
          </label>
          <CustomCropAspect />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Add User
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

export default AddUsersContent;
