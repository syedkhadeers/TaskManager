import multer from "multer";
import path from "path";

// Enhanced allowed file types
const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
  "image/heic",
  "image/avif",
];

// Enhanced storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Enhanced file filter with detailed error messages
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`),
      false
    );
  }
};

// Base multer configuration factory
const createMulterConfig = (fileSize = 2, maxFiles = 1) => ({
  storage,
  fileFilter,
  limits: {
    fileSize: fileSize * 1024 * 1024,
    files: maxFiles,
  },
});


// Error handling middleware
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: `File too large. Maximum size is ${
          err.field
            ? createMulterConfig().limits.fileSize / (1024 * 1024)
            : "N/A"
        } MB`,
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: `Too many files. Maximum allowed is ${
          err.field ? createMulterConfig().limits.files : "N/A"
        } files`,
      });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

// Validation middleware
export const validateUpload = (req, res, next) => {
  if (!req.file && !req.files) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  next();
};


// Enhanced upload configurations with specific settings (size , count)
export const uploadUserPhoto = multer(createMulterConfig(5));

export const uploadRoomTypeImages = multer(createMulterConfig(5, 10));

export const uploadRoomImages = multer(createMulterConfig(5, 10));
