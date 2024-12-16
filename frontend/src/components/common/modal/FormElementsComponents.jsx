import React, { useState, useRef } from "react";
import { FiUser  } from "react-icons/fi";
import Select from "react-select";
import { FaCloudUploadAlt, FaFileImage, FaTimes } from "react-icons/fa";



const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const FormElementsComponents = () => {

    {
      /* Single File Upload with Preview == Start*/
    }
    const [selectedFileSingle, setSelectedFileSingle] = useState(null);
    const [previewUrlSingle, setPreviewUrlSingle] = useState(null);
    const fileInputRefSingle = useRef(null);

    const handleFileChangeSinglePreview = (event) => {
      const file = event.target.files[0];
      if (file) {
        setSelectedFileSingle(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrlSingle(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleDragOverSinglePreview = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const handleDropSinglePreview = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const file = event.dataTransfer.files[0];
      if (file) {
        setSelectedFileSingle(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrlSingle(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleRemoveFileSinglePreview = () => {
      setSelectedFileSingle(null);
      setPreviewUrlSingle(null);
      if (fileInputRefSingle.current) {
        fileInputRefSingle.current.value = "";
      }
    };

    {
      /* Single File Upload with Preview == Ends*/
    }

    {
      /* Multiple Files Upload  == Starts*/
    }

     const [files, setFiles] = useState([]);

     const handleFileChangeMultiple = (event) => {
       const selectedFiles = Array.from(event.target.files);
       setFiles(selectedFiles);
     };

    {
      /* Multiple Files Upload  == ends*/
    }

    {
      /* Multiple File Upload with Preview == Start*/
    }

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const fileInputRef = useRef(null);
    const maxFiles = 5; // Set the maximum number of files

    const handleFileChangePreview = (event) => {
      const files = Array.from(event.target.files);
      if (selectedFiles.length + files.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} files.`);
        return;
      }

      const newFiles = files.slice(0, maxFiles - selectedFiles.length);
      setSelectedFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    };

    const handleDragOverPreview = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const handleDropPreview = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const files = Array.from(event.dataTransfer.files);
      if (selectedFiles.length + files.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} files.`);
        return;
      }

      const newFiles = files.slice(0, maxFiles - selectedFiles.length);
      setSelectedFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    };

    const handleRemoveFilePreview = (index) => {
      const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
      const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
      setSelectedFiles(newSelectedFiles);
      setPreviewUrls(newPreviewUrls);
    };

    {
      /* Multiple File Upload with Preview == Start*/
    }





  return (
    <div className="flex justify-center">
      <div className="flex-col">
        <div className="flex items-center justify-center">
          <div className="w-full p-8">
            <form className="space-y-4 gap-4">
              {/* Text Input */}
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light"
                  placeholder="Full Name"
                  required
                />
                <FiUser className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              </div>

              {/* Date Input */}
              <div className="relative">
                <input
                  type="date"
                  className="w-full p-3  bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light"
                  required
                />
              </div>

              {/* Time Input */}
              <div className="relative">
                <input
                  type="time"
                  className="w-full p-3  bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light"
                  required
                />
              </div>

              {/* Color Input */}
              <div className="relative">
                <input
                  type="color"
                  className="w-full p-3  bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light"
                  required
                />
              </div>

              {/* Text Area */}
              <div className="relative">
                <textarea
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light"
                  placeholder="Your Message"
                  required
                />
              </div>

              {/* Checkbox */}
              <div className="relative flex items-center">
                <input type="checkbox" className="mr-2" required />
                <label className="ml-2">Accept Terms and Conditions</label>
              </div>

              {/* Radio Buttons */}
              <div className="relative">
                <label className="block">Choose an option:</label>
                <div className="flex items-center">
                  <input type="radio" name="options" className="mr-2" />
                  <label className="ml-2">Option 1</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" name="options" className="mr-2" />
                  <label className="ml-2">Option 2</label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="px-3 py-3 w-full text-white bg-gradient-dark rounded-lg transition hover:bg-gradient-light hover:text-primary-50 border border-neutral-100"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="flex-col">
        <div className="flex items-center justify-center">
          <div className="w-full p-8">
            <form className="space-y-4 gap-4">
              {/* Single File Upload */}
              <div className="relative">
                <input
                  type="file"
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light"
                />
              </div>

              {/* Single File Upload with Preview */}
              <div
                className={`
                    relative 
                    border-2 border-dashed rounded-lg p-6 
                    transition-all duration-300 
                    ${
                      previewUrlSingle
                        ? "border-primary bg-primary-50"
                        : "border-gray-300 hover:border-primary hover:bg-primary-50"
                    }
                    `}
                onDragOver={handleDragOverSinglePreview}
                onDrop={handleDropSinglePreview}
              >
                <input
                  type="file"
                  ref={fileInputRefSingle}
                  accept="image/*"
                  onChange={handleFileChangeSinglePreview}
                  className="hidden"
                  id="file-upload"
                />

                {!previewUrlSingle ? (
                  <div
                    className="flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => fileInputRefSingle.current.click()}
                  >
                    <FaCloudUploadAlt className="text-5xl text-gray-400 mb-4" />
                    <p className="text-gray-600 text-center">
                      Drag & Drop or Click to Upload
                    </p>
                    <span className="text-sm text-gray-500 mt-2">
                      Supported formats: PNG, JPG, JPEG
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex justify-center mb-4">
                      <img
                        src={previewUrlSingle}
                        alt="Preview"
                        className="max-h-32 rounded-lg object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaFileImage className="text-primary-dark mr-2" />
                        <span className="text-sm truncate max-w-[200px]">
                          {selectedFileSingle.name}
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveFileSinglePreview}
                        className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Multiple Files Upload */}

              <div className="relative">
                <input
                  type="file"
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light"
                  multiple
                  onChange={handleFileChangeMultiple} // Handle file selection
                />
                {/* Display selected files */}
                <ul>
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>

              {/* \multiple Files Upload with Preview */}

              <div
                className={`
        relative 
        border-2 border-dashed rounded-lg p-6 
        transition-all duration-300 
        ${
          previewUrls.length > 0
            ? "border-primary bg-primary-50"
            : "border-gray-300 hover:border-primary hover:bg-primary-50"
        }
      `}
                onDragOver={handleDragOverPreview}
                onDrop={handleDropPreview}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChangePreview}
                  className="hidden"
                  id="file-upload"
                  multiple
                />

                {selectedFiles.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FaCloudUploadAlt className="text-5xl text-gray-400 mb-4" />
                    <p className="text-gray-600 text-center">
                      Drag & Drop or Click to Upload
                    </p>
                    <span className="text-sm text-gray-500 mt-2">
                      Supported formats: PNG, JPG, JPEG
                    </span>
                  </div>
                ) : (
                  <div>
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative mb-4">
                        <div className="flex justify-center mb-2">
                          <img
                            src={url}
                            alt="Preview"
                            className="max-h-32 rounded-lg object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaFileImage className="text-primary-dark mr-2" />
                            <span className="text-sm truncate max-w-[200px]">
                              {selectedFiles[index].name}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveFilePreview(index)}
                            className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
            </form>
          </div>
        </div>
      </div>
      <div className="flex-col">
        <div className="flex items-center justify-center">
          <div className="w-full p-8">
            <form className="space-y-4 gap-4">
              {/* Single select dropdown */}
              <div className="relative">
                <select className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light">
                  <option>Select an option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>

              {/* Multi-select dropdown */}
              <div className="relative">
                <select
                  multiple
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light"
                >
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>

              <div className="relative">
                <Select
                  isMulti
                  options={options}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select options..."
                />
              </div>

              {/* Single checkbox */}
              <div className="relative flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="ml-2">Single Checkbox</label>
              </div>

              {/* Group of checkboxes */}
              <div className="relative">
                <label className="block">Select multiple options:</label>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <label className="ml-2">Checkbox 1</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <label className="ml-2">Checkbox 2</label>
                </div>
              </div>

              {/* Group of radio buttons */}
              <div className="relative">
                <label className="block">Choose an option:</label>
                <div className="flex items-center">
                  <input type="radio" name="group-options" className="mr-2" />
                  <label className="ml-2">Group Option 1</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" name="group-options" className="mr-2" />
                  <label className="ml-2">Group Option 2</label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="flex-col">
        <div className="flex items-center justify-center">
          <div className="w-full p-8">
            <form className="space-y-4 gap-4">
              {/* Single select dropdown */}
              <div className="relative">
                <select className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light">
                  <option>Select an option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>

              {/* Multi-select dropdown */}
              <div className="relative">
                <select
                  multiple
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light"
                >
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>

              <div className="relative">
                <Select
                  isMulti
                  options={options}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select options..."
                />
              </div>

              {/* Single checkbox */}
              <div className="relative flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="ml-2">Single Checkbox</label>
              </div>

              {/* Group of checkboxes */}
              <div className="relative">
                <label className="block">Select multiple options:</label>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <label className="ml-2">Checkbox 1</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <label className="ml-2">Checkbox 2</label>
                </div>
              </div>

              {/* Group of radio buttons */}
              <div className="relative">
                <label className="block">Choose an option:</label>
                <div className="flex items-center">
                  <input type="radio" name="group-options" className="mr-2" />
                  <label className="ml-2">Group Option 1</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" name="group-options" className="mr-2" />
                  <label className="ml-2">Group Option 2</label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormElementsComponents;