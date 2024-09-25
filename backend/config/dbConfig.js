const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        const uri = process.env.MONGODB_URI; // Ensure this is correctly set
        if (!uri) {
            throw new Error("MongoDB URI is not defined.");
        }
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Database connection error:', error.message);
    }
};

module.exports = dbConnect;
