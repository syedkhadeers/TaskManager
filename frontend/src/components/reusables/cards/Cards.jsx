import React from 'react';
import { motion } from "framer-motion";



export const TimeCard = ({ title, value, subtitle, icon, color }) => {
  const colorClasses = {
    blue: "from-blue-400 via-blue-500 to-blue-600",
    purple: "from-purple-400 via-purple-500 to-purple-600",
    green: "from-emerald-400 via-emerald-500 to-emerald-600",
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`bg-gradient-to-br ${colorClasses[color]} px-4 py-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transform transition-all duration-300 backdrop-blur-sm relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-16 -translate-y-16"></div>
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="p-3 bg-white/15 rounded-xl backdrop-blur-sm shadow-inner">
          {icon}
        </div>
        <div className="space-y-2 text-center">
          <h5 className="font-medium text-sm text-white/90 tracking-wider">
            {title}
          </h5>
          <p className="text-2xl font-bold bg-clip-text">{value}</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl transform -translate-x-12 translate-y-12"></div>
    </motion.div>
  );
};

export const PriceCard = ({ title, amount, icon, color }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-br ${colorClasses[color]} p-6 rounded-xl text-white`}
    >
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-2xl font-bold">${amount?.toFixed(2) || "0.00"}</p>
    </motion.div>
  );
};