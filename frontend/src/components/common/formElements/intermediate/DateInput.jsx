import React, { useState } from "react";
import { FiUser, FiLock, FiMail, FiSearch, FiPhone } from "react-icons/fi";

const DateInput = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    datetime: "",
    dateRangeStart: "",
    dateRangeEnd: "",
    timeRangeStart: "",
    timeRangeEnd: "",
    week: "",
    month: "",
    year: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
              {/* Date Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                />
              </div>

              {/* Time Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                />
              </div>

              {/* Datetime Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date and Time
                </label>
                <input
                  type="datetime-local"
                  name="datetime"
                  value={formData.datetime}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow -custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                />
              </div>

              {/* Date Range Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    name="dateRangeStart"
                    value={formData.dateRangeStart}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                  />
                  <input
                    type="date"
                    name="dateRangeEnd"
                    value={formData.dateRangeEnd}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                  />
                </div>
              </div>

              {/* Time Range Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Time Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="time"
                    name="timeRangeStart"
                    value={formData.timeRangeStart}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                  />
                  <input
                    type="time"
                    name="timeRangeEnd"
                    value={formData.timeRangeEnd}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                  />
                </div>
              </div>

              {/* Week Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Week
                </label>
                <input
                  type="week"
                  name="week"
                  value={formData.week}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                />
              </div>

              {/* Month Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Month
                </label>
                <input
                  type="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                />
              </div>

              {/* Year Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                  placeholder="Year"
                />
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

export default DateInput;
