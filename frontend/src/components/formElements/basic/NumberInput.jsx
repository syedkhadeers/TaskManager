import React, { useState } from "react";
import { FiPhone, FiDollarSign, FiHash } from "react-icons/fi";

const NumberInput = () => {
  const [formData, setFormData] = useState({
    telephone: "",
    integerInput: "",
    decimalInput: "",
    currencyInput: "",
    rangeInput: 50, // Default value for range input
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.telephone) newErrors.telephone = "Telephone is required";   
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
        <div className="flex items-center justify-center">
          <div className="w-full p-8">
            <form className="space-y-4 gap-4" onSubmit={handleSubmit}>
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

              {/* Integer Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Integer Input
                </label>
                <input
                  type="number"
                  name="integerInput"
                  value={formData.integerInput}
                  onChange={handleChange}
                  className="w-full p-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                  placeholder="Integer Input"
                  required
                />
                <FiHash className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              </div>

              {/* Decimal Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Decimal Input
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="decimalInput"
                  value={formData.decimalInput}
                  onChange={handleChange}
                  className="w-full p-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                  placeholder="Decimal Input"
                  required
                />
                <FiHash className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              </div>

              {/* Currency Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Currency Input
                </label>
                <input
                  type="number"
                  name="currencyInput"
                  value={formData.currencyInput}
                  onChange={handleChange}
                  className="w-full p-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                  placeholder="Currency Input"
                  required
                />
                <FiDollarSign className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              </div>

              {/* Range Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Range Input
                </label>
                <input
                  type="range"
                  name="rangeInput"
                  value={formData.rangeInput}
                  onChange={handleChange}
                  className="w-full"
                  min="0"
                  max="100"
                />

                <p>Value: {formData.rangeInput}</p>
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

export default NumberInput;