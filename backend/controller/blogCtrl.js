const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary"); // Assuming cloudinary upload utility
const fs = require("fs");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");

    await Blog.findByIdAndUpdate(id, {
      $inc: { numViews: 1 },
    });

    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    res.json(deletedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const liketheBlog = asyncHandler(async (req, res) => {
  try {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    const blog = await Blog.findById(blogId);
    const loginUserId = req.user._id;

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const alreadyDisliked = blog.dislikes.includes(loginUserId);
    const isLiked = blog.likes.includes(loginUserId);

    if (alreadyDisliked) {
      blog.dislikes = blog.dislikes.filter(
        (userId) => userId.toString() !== loginUserId.toString()
      );
      blog.isDisliked = false;
    }

    if (isLiked) {
      blog.likes = blog.likes.filter(
        (userId) => userId.toString() !== loginUserId.toString()
      );
      blog.isLiked = false;
    } else {
      blog.likes.push(loginUserId);
      blog.isLiked = true;
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const disliketheBlog = asyncHandler(async (req, res) => {
  try {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    const blog = await Blog.findById(blogId);
    const loginUserId = req.user._id;

    const isDisLiked = blog.isDisliked;
    const alreadyLiked = blog.likes.includes(loginUserId);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(
        (userId) => userId.toString() !== loginUserId.toString()
      );
      blog.isLiked = false;
    }

    if (isDisLiked) {
      blog.dislikes = blog.dislikes.filter(
        (userId) => userId.toString() !== loginUserId.toString()
      );
      blog.isDisliked = false;
    } else {
      blog.dislikes.push(loginUserId);
      blog.isDisliked = true;
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      fs.unlinkSync(path); // Remove local file after uploading
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { images: urls },
      { new: true }
    );

    res.json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  liketheBlog,
  disliketheBlog,
  uploadImages,
};
