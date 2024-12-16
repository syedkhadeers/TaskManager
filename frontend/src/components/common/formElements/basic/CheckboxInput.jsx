import React, { useState, useContext } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";

const CheckboxInput = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    checkboxes: {
      check1: false,
      check2: false,
      check3: false,
    },
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      checkboxes: {
        ...prevData.checkboxes,
        [name]: checked,
      },
    }));
  };

  return (
    <div className="flex justify-start border-b">
      <div className="flex-col  w-full">
        <form className="space-y-4 px-8 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700   dark:text-gray-300">
              Checkboxes
            </label>
            <div className="flex flex-row space-x-4  bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500 p-4 ">
              {" "}
              {/* Changed to flex-row and added space-x-4 */}
              {Object.keys(formData.checkboxes).map((key) => (
                <label key={key} className="inline-flex items-center  w-full">
                  <input
                    type="checkbox"
                    name={key}
                    checked={formData.checkboxes[key]}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 capitalize">
                    {key.replace("check", "Opt ")}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckboxInput;
