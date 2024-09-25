const cloudinary = require("cloudinary").v2; // Use v2 for the latest features

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

// Function to upload an image to Cloudinary
const cloudinaryUploadImg = async (fileToUpload) => {
  try {
    const result = await cloudinary.uploader.upload(fileToUpload);
    return {
      url: result.secure_url,
      asset_id: result.asset_id,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error(`Cloudinary upload error: ${error.message}`);
  }
};

// Function to delete an image from Cloudinary
const cloudinaryDeleteImg = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === "ok", // Check if the delete was successful
      public_id: publicId,
    };
  } catch (error) {
    throw new Error(`Cloudinary delete error: ${error.message}`);
  }
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
