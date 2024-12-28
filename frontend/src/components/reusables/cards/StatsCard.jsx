import React from "react";
import { motion } from "framer-motion";

const StatsCard = ({ title, value, icon, trend, isLoading }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
              {value}
            </p>
            {trend && (
              <span
                className={`text-sm ${
                  trend > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
            )}
          </div>
          <div className="text-blue-500 dark:text-blue-400">{icon}</div>
        </div>
      )}
    </motion.div>
  );
};


export default StatsCard;
