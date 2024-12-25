import React, { useState } from "react";
import Select from "react-select";
import { FiChevronDown } from "react-icons/fi";

const SelectInput = () => {
  const [formData, setFormData] = useState({
    singleSelect: null,
    multipleSelect: [],
    reactSelectMultiple: [],
  });

  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const singleSelectOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const multipleSelectOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const handleChange = (selectedOption, name) => {
    setFormData({ ...formData, [name]: selectedOption });
  };

  const handleMultiChange = (selectedOptions, name) => {
    setFormData({ ...formData, [name]: selectedOptions });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.singleSelect)
      newErrors.singleSelect = "Selection is required";
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

  const handleFileChangeMultiple = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleFileChangeSingle = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="flex-col w-full">
          <div className="flex items-center justify-center">
            <div className="w-full p-8">
              <form className="space-y-4 gap-4" onSubmit={handleSubmit}>
                {/* Single Select Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Single Select
                  </label>
                  <Select
                    options={singleSelectOptions}
                    value={formData.singleSelect}
                    onChange={(option) => handleChange(option, "singleSelect")}
                    className="basic-single bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                    classNamePrefix="select"
                    components={{
                      DropdownIndicator: () => (
                        <FiChevronDown className="text-gray-500 dark:text-gray-400" />
                      ),
                      IndicatorSeparator: null,
                    }}
                  />
                  {errors.singleSelect && (
                    <p className="text-red-500 text-xs">
                      {errors.singleSelect}
                    </p>
                  )}
                </div>

                {/* Multiple Select Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Multiple Select
                  </label>
                  <Select
                    options={multipleSelectOptions}
                    value={formData.multipleSelect}
                    onChange={(options) =>
                      handleMultiChange(options, "multipleSelect")
                    }
                    isMulti
                    className="basic-multi-select bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                    classNamePrefix="select"
                    components={{
                      DropdownIndicator: () => (
                        <FiChevronDown className="text-gray-500 dark:text-gray-400" />
                      ),
                      IndicatorSeparator: null,
                    }}
                  />
                </div>

                {/* React-Select Multiple */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    React-Select Multiple
                  </label>
                  <Select
                    options={multipleSelectOptions}
                    value={formData.reactSelectMultiple}
                    onChange={(options) =>
                      handleMultiChange(options, " reactSelectMultiple")
                    }
                    isMulti
                    className="basic-multi-select bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500"
                    classNamePrefix="select"
                    components={{
                      DropdownIndicator: () => (
                        <FiChevronDown className="text-gray-500 dark:text-gray-400" />
                      ),
                      IndicatorSeparator: null,
                    }}
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
      <div className="flex justify-center items-center">
        <div className="flex-col w-full">
          <h1 className="text-xl font-bold border-b-2 border-b-slate-400">
            Multiple Files Upload
          </h1>

          {/* Single file upload */}
          <div className="flex items-center justify-center">
            <div className="w-full px-8 py-4">
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ">
                  Single file upload:
                </label>
                <input
                  type="file"
                  onChange={handleFileChangeSingle}
                  className="bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500 p-4"
                />
              </div>
            </div>
          </div>

          {/* Multiple file upload */}
          <div className="flex items-center justify-center">
            <div className="w-full px-8 py-4">
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ">
                  Multiple file upload:
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChangeMultiple}
                  className="bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500 p-4"
                />
                {files.map((file, index) => (
                  <div key={index}>{file.name}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectInput;
