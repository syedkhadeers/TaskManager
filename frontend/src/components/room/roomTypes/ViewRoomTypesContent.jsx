import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { X, DollarSign, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";

const ViewRoomTypesContent = ({ roomType, onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className={`h-full ${isDarkMode ? "dark" : ""}`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">View Room Type</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="p-6 overflow-y-auto max-h-[calc(100vh-80px)]">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">{roomType.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {roomType.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard
              icon={<DollarSign />}
              label="Base Price"
              value={`$${roomType.basePrice}`}
            />
            <InfoCard
              icon={<DollarSign />}
              label="Special Price"
              value={
                roomType.specialPrice ? `$${roomType.specialPrice}` : "N/A"
              }
            />
            <InfoCard
              icon={<DollarSign />}
              label="Offer Price"
              value={roomType.offerPrice ? `$${roomType.offerPrice}` : "N/A"}
            />
          </div>

          <InfoCard
            icon={<Users />}
            label="Max Occupancy"
            value={roomType.maxOccupancy}
          />

          <div>
            <h4 className="text-lg font-semibold mb-2">Extra Services</h4>
            <div className="flex flex-wrap gap-2">
              {roomType.extraServices.map((service) => (
                <span
                  key={service._id}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {service.serviceName}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Time Slot Pricing</h4>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Time Slot
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {roomType.timeSlotPricing.map((slot, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">{slot.timeSlot.name}</td>
                    <td className="px-6 py-4">${slot.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Room Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {roomType.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Room ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                roomType.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span className="text-sm text-gray-700 dark:text-gray-200">
              {roomType.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);

export default ViewRoomTypesContent;
