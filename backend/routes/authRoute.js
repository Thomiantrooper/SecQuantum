const express = require("express");
const {
    createUser,
    loginUserCtrl,
    getallUser,
    getaUser,
    deleteaUser, // Changed from deleteaUser to deleteUser
    updatedUser, // Changed from updatedUser to updateUser
    unblockUser,
    blockUser,
    handleRefreshToken,
    logout,
    resetPassword,
    forgotPasswordToken,

    loginAdmin,
    saveAddress,
    getWishlist,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// User registration and login
router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post('/forgotPasswordToken', forgotPasswordToken);
router.put('/resetPassword/:token', resetPassword);

router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);

// User management
router.get('/all-users', authMiddleware, isAdmin, getallUser); // Ensure only admin can access
router.get('/:id', authMiddleware, getaUser);

// User blocking/unblocking
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

// Wishlist management
router.get("/wishlist", authMiddleware, getWishlist);

module.exports = router;
