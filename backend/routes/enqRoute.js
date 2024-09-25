const express = require("express");
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
  replyToEnquiry,
} = require("../controller/enqCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// Create a new enquiry
router.post("/", createEnquiry);

// Get all enquiries
router.get("/", getallEnquiry);

// Get a specific enquiry by ID
router.get("/:id", getEnquiry);

// Update an enquiry (Admin only)
router.put("/:id", authMiddleware, isAdmin, updateEnquiry);

// Delete an enquiry (Admin only)
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry);

// Reply to an enquiry (Admin only)
router.put("/:enquiryId/reply", authMiddleware, isAdmin, replyToEnquiry);

module.exports = router;
