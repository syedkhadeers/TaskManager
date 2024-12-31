import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Package,
  Clock,
  Info,
  Tag,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
} from "lucide-react";
import { PriceCard } from "../../../reusables/cards/Cards";

const ViewExtraServicesContent = ({
  service,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="relative">
      {/* Top Action Buttons */}
      <div className="absolute top-0 right-0 flex gap-2 p-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(service)}
          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-300"
        >
          <Edit3 className="h-5 w-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(service)}
          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-300"
        >
          <Trash2 className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"
          >
            <Package className="h-12 w-12 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {service.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {service.serviceType}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleStatus(service)}
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${
              service.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {service.isActive ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            {service.isActive ? "Active" : "Inactive"}
          </motion.button>
        </div>

        {/* Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PriceCard
            title="Base Price"
            amount={service.basePrice}
            icon={<DollarSign className="h-6 w-6" />}
            color="blue"
          />
          <PriceCard
            title="Special Price"
            amount={service.specialPrice}
            icon={<Tag className="h-6 w-6" />}
            color="purple"
          />
          <PriceCard
            title="Offer Price"
            amount={service.offerPrice}
            icon={<Tag className="h-6 w-6" />}
            color="green"
          />
        </div>

        {/* Description Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Description
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {service.description || "No description available"}
          </p>
        </div>

        {/* Additional Info */}
        {service.additionalInfo && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-purple-500" />
              Additional Information
            </h2>
            <div className="prose dark:prose-invert">
              {service.additionalInfo}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export default ViewExtraServicesContent;
