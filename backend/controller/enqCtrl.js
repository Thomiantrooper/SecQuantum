const Enquiry = require("../models/enqModel");
const asyncHandler = require("express-async-handler");

// Create a new enquiry
const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    res.status(201).json(newEnquiry); // Return 201 status for resource creation
  } catch (error) {
    res.status(500).json({ message: "Failed to create enquiry", error: error.message });
  }
});

// Update an existing enquiry
const updateEnquiry = asyncHandler(async (req, res) => {
  try {
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedEnquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json(updatedEnquiry);
  } catch (error) {
    res.status(500).json({ message: "Failed to update enquiry", error: error.message });
  }
});

// Delete an enquiry
const deleteEnquiry = asyncHandler(async (req, res) => {
  try {
    const deletedEnquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!deletedEnquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json({ message: "Enquiry deleted successfully", deletedEnquiry });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete enquiry", error: error.message });
  }
});

// Get a single enquiry by ID
const getEnquiry = asyncHandler(async (req, res) => {
  try {
    const getaEnquiry = await Enquiry.findById(req.params.id);

    if (!getaEnquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json(getaEnquiry);
  } catch (error) {
    res.status(500).json({ message: "Failed to get enquiry", error: error.message });
  }
});

// Get all enquiries
const getallEnquiry = asyncHandler(async (req, res) => {
  try {
    const getallEnquiry = await Enquiry.find();
    res.json(getallEnquiry);
  } catch (error) {
    res.status(500).json({ message: "Failed to get all enquiries", error: error.message });
  }
});

// Reply to an enquiry
const replyToEnquiry = asyncHandler(async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const { managerReply } = req.body;

    if (!managerReply) {
      return res.status(400).json({ message: "Manager reply is required" });
    }

    const enquiry = await Enquiry.findById(enquiryId);

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    enquiry.managerReply = managerReply;
    enquiry.status = "Resolved"; // Update status as required

    const updatedEnquiry = await enquiry.save();
    res.json(updatedEnquiry);
  } catch (error) {
    res.status(500).json({ message: "Failed to reply to enquiry", error: error.message });
  }
});

module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
  replyToEnquiry,
};
