import React, { useState } from "react";
import { FiUser, FiLock, FiMail, FiSearch, FiPhone } from "react-icons/fi";

const TextInput = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    email: "",
    search: "",
    telephone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.search) newErrors.search = "Search is required";
    if (!formData.telephone) newErrors.telephone = "Telephone is required";
    if (!formData.message) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      // Submit form
      console.log("Form submitted:", formData);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex-col">
        <div className="flex items-center justify-center ">
          <div className="w-full p-8">
            <form className="space-y-4 gap-4 " onSubmit={handleSubmit}>
              {/* Full Name Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                  placeholder="Full Name"
                />
                <FiUser className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />

                {errors.fullName && (
                  <p className="text-red-500 text-xs">{errors.fullName}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                  placeholder="Password"
                />
                <FiLock className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              {/* Email Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                  placeholder="Email"
                />
                <FiMail className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              {/* Search Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Search
                </label>
                <input
                  type="search"
                  name="search"
                  value={formData.search}
                  onChange={handleChange}
                  className="w-full p-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                  placeholder="Search"
                />
                <FiSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                {errors.search && (
                  <p className="text-red-500 text-xs">{errors.search}</p>
                )}
              </div>

              {/* Telephone Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Telephone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full p-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                  placeholder="Telephone"
                />
                <FiPhone className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                {errors.telephone && (
                  <p className="text-red-500 text-xs">{errors.telephone}</p>
                )}
              </div>

              {/* Message Text Area */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                  placeholder="Your Message"
                />
                {errors.message && (
                  <p className="text-red-500 text-xs">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextInput;
