const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
const enqSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures that no two enquiries can have the same email
    validate: {
      validator: function(v) {
        // Simple regex for basic email validation
        return /^([\w-]+(?:\.[\w-]+)*)@([\w-]+(?:\.[\w-]+)+)$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    },
  },
  mobile: {
    type: String, // Changed from Number to String
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Submitted",
    enum: ["Submitted", "Contacted", "In Progress", "Resolved"],
  },
  managerReply: {
    type: String,
    default: '', // Optional: Default to an empty string if there's no reply
  },
}, { timestamps: true }); // Added timestamps option

// Export the model
module.exports = mongoose.model("Enquiry", enqSchema);
