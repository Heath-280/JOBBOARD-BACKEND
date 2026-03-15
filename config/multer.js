const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// ── Storage for company logos (images) ───────────────────
const logoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "jobboard/logos",
        allowed_formats: ["jpg", "jpeg", "png"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
        resource_type: "image"
    }
});

// ── Storage for resumes (PDF) ─────────────────────────────
const resumeStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "jobboard/resumes",
        allowed_formats: ["pdf"],
        resource_type: "raw"  // important — cloudinary needs "raw" for non-image files
    }
});

// ── Logo upload middleware ────────────────────────────────
const uploadLogo = multer({
    storage: logoStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for images
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/jpg", "image/png"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG and PNG images are allowed"), false);
        }
    }
});

// ── Resume upload middleware ──────────────────────────────
const uploadResume = multer({
    storage: resumeStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for PDFs
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"), false);
        }
    }
});

module.exports = { uploadLogo, uploadResume };