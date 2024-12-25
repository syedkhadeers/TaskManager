import { motion } from "framer-motion";

export const BasicCard1 = ({ icon, label, value, className }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
  >
    <div className="flex items-center gap-4">
      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </p>
      </div>
    </div>
  </motion.div>
);
