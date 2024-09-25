const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshtoken");
const User = require("../models/userModel");
const uniqid = require("uniqid");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


// Create a new user
const createUser = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});

// User login
const loginUserCtrl = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.isPasswordMatched(password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const refreshToken = await generateRefreshToken(user._id);
        await User.findByIdAndUpdate(user._id, { refreshToken });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            mobile: user.mobile,
            token: generateToken(user._id),
        });
    } catch (error) {
        next(error);
    }
});

// Admin login
const loginAdmin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const findAdmin = await User.findOne({ email });
        if (!findAdmin || findAdmin.role !== "admin") {
            return res.status(403).json({ error: "Not authorized" });
        }
        if (await findAdmin.isPasswordMatched(password)) {
            const refreshToken = await generateRefreshToken(findAdmin._id);
            await User.findByIdAndUpdate(findAdmin._id, { refreshToken });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            });
            res.json({
                _id: findAdmin._id,
                firstname: findAdmin.firstname,
                lastname: findAdmin.lastname,
                email: findAdmin.email,
                mobile: findAdmin.mobile,
                token: generateToken(findAdmin._id),
            });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        next(error);
    }
});

// Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(400).json({ error: "No refresh token in cookies" });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ error: "Invalid refresh token" });
        }
        const accessToken = generateToken(user._id);
        res.json({ accessToken });
    } catch (error) {
        next(error);
    }
});

// User logout
const logout = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(400).json({ error: "No refresh token in cookies" });
    }
    try {
        await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true });
        res.sendStatus(204); // No content
    } catch (error) {
        next(error);
    }
});

// Update user details
const updatedUser = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
});

// Save user's address
const saveAddress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, { address: req.body.address }, { new: true });
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
});

// Get all users
const getallUser = asyncHandler(async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        next(error);
    }
});

// Get a user by ID
const getaUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
});

// Delete a user by ID
const deleteaUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        next(error);
    }
});

// Block a user
const blockUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const blockedUser = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
        res.json({ message: "User blocked", blockedUser });
    } catch (error) {
        next(error);
    }
});

// Unblock a user
const unblockUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const unblockedUser = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        res.json({ message: "User unblocked", unblockedUser });
    } catch (error) {
        next(error);
    }
});

// Update password
const updatePassword = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    try {
        const user = await User.findById(_id);
        if (password) {
            user.password = password;
            const updatedPassword = await user.save();
            res.json({ message: "Password updated", updatedPassword });
        } else {
            res.status(400).json({ error: "Password is required" });
        }
    } catch (error) {
        next(error);
    }
});

// Forgot password token
const forgotPasswordToken = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found with this email" });
        }
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, please follow this link to reset your password. This link is valid for 10 minutes. <a href='http://localhost:3000/reset-password/${token}'>Click Here</>`;
        const data = {
            to: email,
            subject: "Password Reset Link",
            html: resetURL,
        };
        sendEmail(data);
        res.json({ message: "Password reset link sent", token });
    } catch (error) {
        next(error);
    }
});

// Reset password
const resetPassword = asyncHandler(async (req, res, next) => {
    const { password } = req.body;
    const { token } = req.params;
    try {
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ error: "Token expired. Please try again later." });
        }
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        res.json({ message: "Password reset successful", user });
    } catch (error) {
        next(error);
    }
});

// Get user's wishlist
const getWishlist = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    try {
        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser);
    } catch (error) {
        next(error);
    }
});

module.exports = {
    createUser,
    loginUserCtrl,
    loginAdmin,
    handleRefreshToken,
    logout,
    updatedUser,
    saveAddress,
    getallUser,
    getaUser,
    deleteaUser,
    blockUser,
    unblockUser,
    forgotPasswordToken,
    resetPassword,
    getWishlist,
};
