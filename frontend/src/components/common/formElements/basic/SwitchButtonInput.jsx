import { useState } from "react";
import { ImHappy, ImSad } from "react-icons/im";
import { FaRegLightbulb, FaRegMoon } from "react-icons/fa"; // New icons for the additional switches
import { FaRegCircleXmark, FaRegCircleCheck } from "react-icons/fa6";

const SwitchButtonInput = () => {
  const [enabled1, setEnabled1] = useState(false);
  const [enabled2, setEnabled2] = useState(false);
  const [enabled3, setEnabled3] = useState(false);

  const toggleSwitch1 = () => {
    setEnabled1((prev) => !prev);
  };

  const toggleSwitch2 = () => {
    setEnabled2((prev) => !prev);
  };

  const toggleSwitch3 = () => {
    setEnabled3((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-start justify-start px-8 py-6 space-y-4 border-b-2 w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Switches
      </label>
      {/* First Switch */}
      <label className="inline-flex items-center cursor-pointer  bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500 p-4 w-full ">
        <input
          type="checkbox"
          className="sr-only "
          checked={enabled1}
          readOnly
        />
        <div
          onClick={toggleSwitch1}
          className={`w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${
            enabled1 ? "bg-green-600" : "bg-gray-200"
          } `}
        >
          <div
            className={`h-6 w-6 rounded-full bg-white border border-gray-300 transition-transform duration-300 ease-in-out ${
              enabled1 ? "translate-x-full" : ""
            } flex items-center justify-center`}
          >
            {enabled1 ? (
              <FaRegCircleCheck className="text-green-600" />
            ) : (
              <FaRegCircleXmark className="text-gray-600" />
            )}
          </div>
        </div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {enabled1 ? "ON" : "OFF"}
        </span>
      </label>

      {/* Second Switch */}
      <label className="inline-flex items-center cursor-pointer  bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500 p-4 w-full">
        <input
          type="checkbox"
          className="sr-only "
          checked={enabled2}
          readOnly
        />
        <div
          onClick={toggleSwitch2}
          className={`w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${
            enabled2 ? "bg-blue-600" : "bg-gray-200"
          }`}
        >
          <div
            className={`h-6 w-6 rounded-full bg-white border border-gray-300 transition-transform duration-300 ease-in-out ${
              enabled2 ? "translate-x-full" : ""
            } flex items-center justify-center`}
          >
            {enabled2 ? (
              <FaRegLightbulb className="text-yellow-400" />
            ) : (
              <FaRegMoon className="text-gray-600" />
            )}
          </div>
        </div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {enabled2 ? "LIGHT" : "DARK"}
        </span>
      </label>

      {/* Third Switch */}
      <label className="inline-flex items-center cursor-pointer  bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-primary-light shadow-custom-light dark:shadow-custom-dark border-neutral-100 dark:border-neutral-500 p-4 w-full">
        <input
          type="checkbox"
          className="sr-only"
          checked={enabled3}
          readOnly
        />
        <div
          onClick={toggleSwitch3}
          className={`w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${
            enabled3 ? "bg-red-600" : "bg-gray-200"
          }`}
        >
          <div
            className={`h-6 w-6 rounded-full bg-white border border-gray-300 transition-transform duration-300 ease-in-out ${
              enabled3 ? "translate-x-full" : ""
            } flex items-center justify-center`}
          >
            {enabled3 ? (
              <ImHappy className="text-red-600" />
            ) : (
              <ImSad className="text-gray-600" />
            )}
          </div>
        </div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {enabled3 ? "HAPPY" : "SAD"}
        </span>
      </label>
    </div>
  );
};

export default SwitchButtonInput;
