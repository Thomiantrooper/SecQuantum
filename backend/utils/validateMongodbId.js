const mongoose = require("mongoose");

const validateMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        throw new Error("Invalid or not found ID");
    }
};

module.exports = validateMongoDbId; // Export the function for use in other files
