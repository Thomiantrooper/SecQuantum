const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const IMAGE_DIR = path.join(__dirname, "../public/images");
const PRODUCT_DIR = path.join(IMAGE_DIR, "products");
const BLOG_DIR = path.join(IMAGE_DIR, "blogs");

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, IMAGE_DIR); // Destination directory for uploaded images
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}.jpg`);
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file format"), false);
    }
};

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 1 * 1024 * 1024 }, // Limit file size to 1MB
});

const resizeImage = async (filePath, outputPath) => {
    try {
        await sharp(filePath)
            .resize(300, 300) // Resize to 300x300 pixels
            .toFormat("jpg")
            .jpeg({ quality: 90 })
            .toFile(outputPath);
        fs.unlinkSync(filePath); // Remove the original uploaded image
    } catch (error) {
        throw new Error(`Error processing image: ${error.message}`);
    }
};

const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            const outputPath = path.join(PRODUCT_DIR, file.filename);
            await resizeImage(file.path, outputPath); // Save resized image to products directory
        })
    );
    next();
};

const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            const outputPath = path.join(BLOG_DIR, file.filename);
            await resizeImage(file.path, outputPath); // Save resized image to blogs directory
        })
    );
    next();
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };
