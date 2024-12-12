import React, { useState, useContext, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ThemeContext } from "../../context/ThemeContext";
import { FiUser, FiMail, FiPhone, FiLock, FiGlobe } from "react-icons/fi";
import { MdAddPhotoAlternate } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

const AddUsersContent = () => {
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

  // New state for image cropping
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1, unit: "%", width: 50 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imageRef = useRef(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo" && files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result);
      });
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there's a cropped image, process it
    if (imageSrc && completedCrop && imageRef.current) {
      const croppedImageBlob = await getCroppedImg(
        imageRef.current,
        completedCrop
      );
      const croppedFile = new File([croppedImageBlob], "profile.jpg", {
        type: "image/jpeg",
      });

      // Update formData with the cropped image
      const updatedFormData = {
        ...formData,
        photo: croppedFile,
      };

      const response = await registerUser(updatedFormData);
      if (response) {
        navigate("/login");
      }
    } else {
      // If no image cropping, proceed with original submission
      const response = await registerUser(formData);
      if (response) {
        navigate("/login");
      }
    }
  };

  return (
    <div className="inset-0 flex items-center justify-center">
      <div
        className={`w-screen p-6 rounded-lg shadow-lg ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Add User</h2>

        <form
          onSubmit={handleSubmit}
          className="font-[sans-serif] m-6 max-w-4xl mx-auto"
        >
          <div className="grid sm:grid-cols-2 gap-10">
            {/* Name */}
            <InputField
              icon={<FiUser />}
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Email */}
            <InputField
              icon={<FiMail />}
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Phone */}
            <InputField
              icon={<FiPhone />}
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />

            {/* Country */}
            <InputField
              icon={<FiGlobe />}
              type="text"
              name="country"
              placeholder="Enter country"
              value={formData.country}
              onChange={handleChange}
            />

            {/* Bio */}
            <div className="sm:col-span-2">
              <textarea
                name="bio"
                placeholder="Enter bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
              />
            </div>

            {/* Role */}
            <div className="relative sm:col-span-2">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
              >
                <option value="user">User </option>
                <option value="admin">Admin</option>
                <option value="creator">Creator</option>
              </select>
            </div>

            {/* Password */}
            <InputField
              icon={<FiLock />}
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* Photo Upload */}
            <div className="relative flex items-center w-full">
              <MdAddPhotoAlternate className="absolute left-4 text-gray-500" />
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                accept="image/*"
                className="px-12 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
              />
            </div>

            {/* Image Cropper */}
            {imageSrc && (
              <div className="mt-4 w-full">
                <ReactCrop
                  src={imageSrc}
                  onImageLoaded={(img) => (imageRef.current = img)}
                  crop={crop}
                  onChange={(newCrop) => setCrop(newCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                >
                  <img src={imageSrc} ref={imageRef} alt="Crop" />
                </ReactCrop>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="mt-8 px-6 py-2.5 w-full text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
          >
            Submit
          </button>
        </form>
      </div>
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
  <div className="relative flex items-center">
    {icon}
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="px-12 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-blue-500 rounded outline-none"
      required={required}
    />
  </div>
);

export default AddUsersContent;
