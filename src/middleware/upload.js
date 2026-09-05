import multer from "multer";
import path from "node:path";

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const allowedExtensions = [
  ".pdf",
  ".doc",
  ".docx",
];

const storage = multer.memoryStorage();

function fileFilter(req, file, callback) {
  const extension = path.extname(file.originalname).toLowerCase();

  const mimeAllowed = allowedMimeTypes.includes(file.mimetype);
  const extensionAllowed = allowedExtensions.includes(extension);

  if (!mimeAllowed || !extensionAllowed) {
    return callback(
      new Error("Format de CV non autorisé. Utilisez PDF, DOC ou DOCX.")
    );
  }

  callback(null, true);
}

export const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter,
});