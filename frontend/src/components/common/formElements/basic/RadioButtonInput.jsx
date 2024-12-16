import React from "react";

const RadioButtonInput = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, additionalRadio1: value });
  };

  return (
    <div className="flex justify-start  border-b">
      <div className="flex-col w-full">
        <form className="space-y-4 px-8 py-6 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700  dark:text-gray-300">
              Radio Buttons
            </label>
            <div className="flex space-x-4 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500 p-4 ">
              <label className="inline-flex items-center w-full">
                <input
                  type="radio"
                  name="additionalRadio"
                  value="radio1"
                  checked="checked"
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Rad 1</span>
              </label>
              <label className="inline-flex items-center w-full">
                <input
                  type="radio"
                  name="additionalRadio"
                  value="radio2"
                  checked="checked"
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Rad 2</span>
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RadioButtonInput;
