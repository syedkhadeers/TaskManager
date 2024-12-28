import React from "react";
import { Menu } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

const FilterDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Filter",
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
        {value || placeholder}
        <ChevronDown className="ml-2 h-4 w-4" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {options.map((option) => (
            <Menu.Item key={option.value}>
              {({ active }) => (
                <button
                  onClick={() => onChange(option.value)}
                  className={`${
                    active ? "bg-gray-100 dark:bg-gray-700" : ""
                  } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full text-left`}
                >
                  {option.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default FilterDropdown;
