const express = require("express");
const {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    liketheBlog,
    disliketheBlog,
    uploadImages,
} = require("../controller/blogCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { blogImgResize, uploadPhoto } = require("../middlewares/uploadImages");

const router = express.Router();

// Create a new blog (Admin only)
router.post("/", authMiddleware, isAdmin, createBlog);

// Upload images for a blog (Admin only)
router.put(
    "/upload/:id",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 2),
    blogImgResize,
    uploadImages
);

// Like a blog
router.put("/like/:id", authMiddleware, liketheBlog); // Updated route to include blog ID

// Dislike a blog
router.put("/dislike/:id", authMiddleware, disliketheBlog); // Updated route to include blog ID

// Update a blog (Admin only)
router.put("/:id", authMiddleware, isAdmin, updateBlog);

// Get a specific blog by ID
router.get("/:id", getBlog);

// Get all blogs
router.get("/", getAllBlogs);

// Delete a blog (Admin only)
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
