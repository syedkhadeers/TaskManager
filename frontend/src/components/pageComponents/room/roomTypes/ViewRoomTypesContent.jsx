import React, { useContext } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import { X, DollarSign, Users, Clock, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BasicCard1 } from "../../../reusables/basicComponents/BasicCard1";
import { BasicTag } from "../../../reusables/basicComponents/BasicTag";
import { BasicTable1 } from "../../../reusables/table/BasicTable1";
import { BasicImageGallery } from "../../../reusables/basicComponents/BasicImageGallery";
import { BasicStatusBadge } from "../../../reusables/basicComponents/BasicStatusBadge";

const ViewRoomTypesContent = ({ roomType, onClose }) => {

  const { isDarkMode } = useContext(ThemeContext);

  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className={`h-full ${isDarkMode ? "dark" : ""}`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{roomType.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
          >
            <X size={24} className="text-white" />
          </button>
        </div>
      </div>

      <div className="p-6 overflow-y-auto max-h-[calc(100vh-80px)] space-y-8">
        <motion.div className="grid grid-cols-1 gap-2">
          <h4 className="text-lg font-semibold p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <DollarSign className="text-blue-600 dark:text-blue-400" />
            Price Chart
          </h4>

          <BasicCard1
            icon={<DollarSign />}
            label="Base Price"
            value={`$${roomType.basePrice}`}
          />
          <BasicCard1
            icon={<DollarSign />}
            label="Special Price"
            value={`$${roomType.specialPrice}`}
          />
          <BasicCard1
            icon={<DollarSign />}
            label="Offer Price"
            value={`$${roomType.offerPrice}`}
          />
          {/* ... other BasicCards */}
        </motion.div>
        <div>
          <h4 className="text-lg font-semibold p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 mb-4">
            <Users className="text-blue-600 dark:text-blue-400" />
            Extra Services
          </h4>
          <div className="flex flex-wrap gap-2">
            {roomType.extraServices.map((service) => (
              <BasicTag key={service._id} text={service.serviceName} />
            ))}
          </div>
        </div>

        <BasicTable1
          headers={["Time Slot", "Price"]}
          data={roomType.timeSlotPricing.map((slot) => ({
            timeSlot: slot.timeSlot.name,
            price: `$${slot.price}`,
          }))}
          icon={<Clock className="text-blue-600 dark:text-blue-400" />}
          title="Time Slot Pricing"
        />

        <BasicImageGallery
          images={roomType.images}
          icon={<Camera className="text-blue-600 dark:text-blue-400" />}
          title="Room Images"
        />

        <BasicStatusBadge
          isActive={roomType.isActive}
          activeText="Active"
          inactiveText="Inactive"
        />
      </div>
    </motion.div>
  );
};

export default ViewRoomTypesContent;
