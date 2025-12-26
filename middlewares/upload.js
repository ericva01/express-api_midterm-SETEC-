const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = "public/images";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename to prevent directory traversal attacks
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(sanitizedFilename)}`;
    cb(null, uniqueFilename);
  },
});

// Enhanced file filter with better validation
const fileFilter = (req, file, cb) => {
  // Allowed MIME types
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ];

  // Allowed file extensions
  const allowedExtensions = /\.(jpeg|jpg|png|webp|gif)$/i;

  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();

  // Check both extension and MIME type
  if (allowedMimeTypes.includes(mimeType) && allowedExtensions.test(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Only JPEG, JPG, PNG, WebP, and GIF images are allowed. Received: ${mimeType}`
      ),
      false
    );
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
    files: 1, // Maximum 1 file per request
  },
});

// Error handling middleware for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    let message = "File upload error";
    let statuscode = 400;

    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = "File size exceeds the 5MB limit";
        break;
      case "LIMIT_FILE_COUNT":
        message = "Too many files. Maximum 1 file allowed";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Unexpected field name. Use the correct field name for file upload";
        break;
      case "LIMIT_PART_COUNT":
        message = "Too many parts in the multipart form";
        break;
      case "LIMIT_FIELD_KEY":
        message = "Field name too long";
        break;
      case "LIMIT_FIELD_VALUE":
        message = "Field value too long";
        break;
      case "LIMIT_FIELD_COUNT":
        message = "Too many fields";
        break;
      default:
        message = err.message || "File upload error";
    }

    return res.status(statuscode).json({
      statuscode,
      message,
      data: null,
    });
  } else if (err) {
    // Other errors (like file filter errors)
    return res.status(400).json({
      statuscode: 400,
      message: err.message || "Invalid file upload",
      data: null,
    });
  }

  next();
};

// Helper function to delete uploaded file (useful for cleanup on error)
const deleteUploadedFile = (filename) => {
  if (filename) {
    const filePath = path.join(uploadDir, filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });
  }
};

// Validation middleware to check if file was uploaded
const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      statuscode: 400,
      message: "No file uploaded. Please select an image file",
      data: null,
    });
  }
  next();
};

module.exports = {
  upload,
  handleMulterError,
  deleteUploadedFile,
  validateFileUpload,
};
