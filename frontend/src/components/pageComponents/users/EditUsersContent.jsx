
import React, { useState, useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { motion } from "framer-motion";
import { updateUserById } from "../../../services/user/userServices";
import { toast } from "react-toastify";
import MultiImageEditor from "../../reusables/editors/MultiImageEditor";
import LoadingSpinner from "../../common/LoadingSpinner";
import InputField from "../../reusables/inputs/InputField"

const EditUsersContent = ({ user, onClose, onUserUpdated }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: user?.title || "Mr.",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    gender: user?.gender || "male",
    dateOfBirth: user?.dateOfBirth || "",
    department: user?.department || "",
    branch: user?.branch || "",
    address: user?.address || "",
    city: user?.city || "",
    pinCode: user?.pinCode || "",
    state: user?.state || "",
    country: user?.country || "India",
    mobile: user?.mobile || "",
    bio: user?.bio || "I am a user",
    role: user?.role || "user",
    alternateMobile: user?.alternateMobile || "",
    isVerified: user?.isVerified || false,
    photo: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const handleImageChange = (processedImages) => {
  if (processedImages && processedImages.length > 0) {
    // Convert the cropped canvas to a file
    fetch(processedImages[0].cropped)
      .then((res) => res.blob())
      .then((blob) => {
        const croppedFile = new File([blob], "profile-photo.jpg", {
          type: "image/jpeg",
        });
        setFormData((prevData) => ({
          ...prevData,
          photo: croppedFile,
        }));
      });
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await updateUserById(user._id, formData);
      toast.success("User updated successfully!");
      onUserUpdated(response.data);
      onClose();
    } catch (error) {
      const errorMessage = error.message || "Failed to update user";
      toast.error(errorMessage);
      console.error("Error updating user:", error);
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
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Title"
              type="select"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              options={["Mr.", "Mrs.", "Miss.", "Ms.", "Dr.", "Prof."]}
            />

            <InputField
              label="First Name"
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />

            <InputField
              label="Last Name"
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />

            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <InputField
              label="Role"
              type="select"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              options={["user", "admin", "creator", "superadmin", "manager"]}
            />

            <InputField
              label="Gender"
              type="select"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              options={["male", "female", "other"]}
            />

            <InputField
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />

            <InputField
              label="Department"
              type="text"
              name="department"
              placeholder="Enter department"
              value={formData.department}
              onChange={handleInputChange}
            />

            <InputField
              label="Branch"
              type="text"
              name="branch"
              placeholder="Enter branch"
              value={formData.branch}
              onChange={handleInputChange}
            />

            <InputField
              label="Address"
              type="text"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleInputChange}
            />

            <InputField
              label="City"
              type="text"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleInputChange}
            />

            <InputField
              label="Pin Code"
              type="text"
              name="pinCode"
              placeholder="Enter pin code"
              value={formData.pinCode}
              onChange={handleInputChange}
            />

            <InputField
              label="State"
              type="text"
              name="state"
              placeholder="Enter state"
              value={formData.state}
              onChange={handleInputChange}
            />

            <InputField
              label="Country"
              type="text"
              name="country"
              placeholder="Enter country"
              value={formData.country}
              onChange={handleInputChange}
            />

            <InputField
              label="Mobile"
              type="tel"
              name="mobile"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleInputChange}
            />

            <InputField
              label="Alternate Mobile"
              type="tel"
              name="alternateMobile"
              placeholder="Enter alternate mobile number"
              value={formData.alternateMobile}
              onChange={handleInputChange}
            />

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                Bio
              </label>
              <textarea
                name="bio"
                placeholder="Enter bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isVerified"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleInputChange}
                  className="mr-2 rounded text-blue-500 dark:bg-gray-600 focus:ring-blue-400"
                />
                <label
                  htmlFor="isVerified"
                  className="text-sm text-gray-700 dark:text-gray-200"
                >
                  Is Verified
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Profile Photo
            </label>
            <MultiImageEditor
              onImagesChange={handleImageChange}
              maxImages={1}
              initialImages={
                user?.photo?.url ? [{ preview: user.photo.url }] : []
              }
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};



export default EditUsersContent;
