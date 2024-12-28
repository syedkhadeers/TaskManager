import { motion } from "framer-motion";

export const BasicImageGallery = ({ images, icon, title, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm ${className}`}
  >
    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
      {icon}
      {title}
    </h4>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          className="aspect-video relative rounded-lg overflow-hidden group"
        >
          <img
            src={image}
            alt={`Image ${index + 1}`}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </motion.div>
      ))}
    </div>
  </motion.div>
);
