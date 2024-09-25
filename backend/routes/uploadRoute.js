const express = require("express");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");

const router = express.Router();

// Route for uploading images (Admin only)
router.post(
  "/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10), // Limit to 10 images
  productImgResize, // Resize images after upload
  uploadImages // Controller function to handle the upload
);

// Route for deleting images by ID (Admin only)
router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

module.exports = router;
