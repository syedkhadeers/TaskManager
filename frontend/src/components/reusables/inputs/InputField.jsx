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
  isDarkMode,
  options,
  className = "",
}) => {
  const baseInputStyles = `w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`;

  const labelStyles = `block text-sm font-medium mb-2 ${
    isDarkMode ? "text-gray-200" : "text-gray-700"
  }`;

  const errorStyles = "mt-1 text-sm text-red-500";

  if (type === "select") {
    return (
      <div>
        <label className={labelStyles}>{label}</label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={baseInputStyles}
        >
          {options?.map((option) => (
            <option
              key={option}
              value={option}
              className={isDarkMode ? "bg-gray-700" : "bg-white"}
            >
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
