const fs = require("fs");
const asyncHandler = require("express-async-handler");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");

// Upload multiple images
const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = async (path) => await cloudinaryUploadImg(path, "images"); // Ensure async-await
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path); // Upload to Cloudinary
      urls.push(newpath); // Store URL
      fs.unlinkSync(path); // Delete local file after upload
    }

    res.status(201).json({
      message: "Images uploaded successfully",
      images: urls.map((file) => file), // Map and return images array
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to upload images",
      error: error.message,
    });
  }
});

// Delete an image by ID
const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await cloudinaryDeleteImg(id, "images"); // Ensure delete is awaited
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete image",
      error: error.message,
    });
  }
});

module.exports = {
  uploadImages,
  deleteImages,
};
