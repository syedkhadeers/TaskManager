import React, { useState } from "react";

function RadioGroup1({ label, name, value, options, onChange, disabled }) {
  return (
    <div className="flex justify-start border-b">
      <div className="flex-col w-full">
        <form className="space-y-4 px-8 py-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
              {label}
            </label>
            <div className="flex flex-col  bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500 p-4 ">
              {options.map((option) => (
                <label
                  key={option.id}
                  className={`inline-flex items-center p-2 rounded-lg transition-colors duration-200 w-full ${
                    value === option.id
                      ? "bg-red-600  "
                      : "hover:bg-gray-700 dark:hover:bg-gray-800 text-white hover:text-white"
                  }`}
                  onClick={() => !disabled && onChange(option.id)}
                >
                  <input
                    type="radio"
                    name={name}
                    value={option.id}
                    checked={value === option.id}
                    onChange={() => onChange(option.id)}
                    disabled={disabled}
                    className="form-radio h-4 w-4 text-red-500 border-gray-600 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 capitalize text-gray-700 dark:text-gray-200 hover:text-white">
                    {option.caption}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function RadioButtonVInput() {
  const [value, setValue] = useState("1");

  return (
    <div className="flex flex-col rounded-lg">
      <RadioGroup1
        name="options"
        label="Radio Buttons Vertical:"
        value={value}
        onChange={setValue}
        options={[
          { id: "1", caption: "Option 1" },
          { id: "2", caption: "Option 2" },
          { id: "3", caption: "Option 3" },
          { id: "4", caption: "Option 4" },
        ]}
      />
    </div>
  );
}

export default RadioButtonVInput;
