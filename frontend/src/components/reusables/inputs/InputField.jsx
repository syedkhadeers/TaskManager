import React from "react";

const InputField = ({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required,
  error,
  options,
  className = "",
}) => {
  const baseInputStyles = `
    w-full 
    px-4 
    py-2 
    rounded-lg 
    transition-colors
    duration-200
    border
    bg-white 
    dark:bg-gray-800
    border-gray-300 
    dark:border-gray-600
    text-gray-700 
    dark:text-gray-200
    placeholder-gray-500 
    dark:placeholder-gray-400
    focus:ring-2
    focus:border-transparent
    outline-none
    hover:border-gray-400 
    dark:hover:border-gray-500
    ${
      error
        ? "border-red-500 focus:ring-red-500"
        : "focus:ring-blue-500 dark:focus:ring-blue-400"
    }
    ${className}
  `;

  const labelStyles = `
    block 
    text-sm 
    font-medium 
    mb-2 
    text-gray-700 
    dark:text-gray-200
    hover:text-gray-900 
    dark:hover:text-gray-100
  `;

  const errorStyles = `
    mt-1 
    text-sm 
    text-red-500 
    dark:text-red-400
  `;

  const selectStyles = `
    ${baseInputStyles}
    appearance-none 
    cursor-pointer
    pr-10
  `;

  const optionStyles = `
    py-2 
    px-4 
    bg-white 
    dark:bg-gray-800
    text-gray-700 
    dark:text-gray-200
    hover:bg-gray-100 
    dark:hover:bg-gray-700
  `;

  if (type === "select") {
    return (
      <div className="relative">
        <label className={labelStyles}>{label}</label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={selectStyles}
        >
          {options?.map((option) => (
            <option key={option} value={option} className={optionStyles}>
              {option}
            </option>
          ))}
        </select>
        {error && <p className={errorStyles}>{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <label className={labelStyles}>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={baseInputStyles}
      />
      {error && <p className={errorStyles}>{error}</p>}
    </div>
  );
};

export default InputField;
