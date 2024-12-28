import { motion } from "framer-motion";

export const BasicStatusBadge = ({
  isActive,
  activeText,
  inactiveText,
  className,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm ${className}`}
  >
    <motion.span
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className={`inline-block w-3 h-3 rounded-full mr-2 ${
        isActive
          ? "bg-green-500 shadow-lg shadow-green-500/20"
          : "bg-red-500 shadow-lg shadow-red-500/20"
      }`}
    />
    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
      {isActive ? activeText : inactiveText}
    </span>
  </motion.div>
);
