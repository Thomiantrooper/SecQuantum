const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);
                if (user) {
                    req.user = user;
                    return next();
                } else {
                    return res.status(404).json({ error: "User not found" });
                }
            } else {
                return res.status(401).json({ error: "Token not provided" });
            }
        } catch (error) {
            return res.status(401).json({ error: "Not authorized, token expired or invalid. Please login again." });
        }
    } else {
        return res.status(401).json({ error: "Authorization header is missing or invalid" });
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if (!adminUser) {
        return res.status(404).json({ error: "Admin user not found" });
    }
    if (adminUser.role !== "admin") {
        return res.status(403).json({ error: "You are not an admin" });
    } else {
        return next();
    }
});

module.exports = { authMiddleware, isAdmin };
