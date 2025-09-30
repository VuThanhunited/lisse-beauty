const express = require("express");
const {
  register,
  login,
  getMe,
  logout,
  refreshToken,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { validateRegister, validateLogin } = require("../middleware/validation");

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", validateRegister, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", validateLogin, login);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get("/me", protect, getMe);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", protect, logout);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post("/refresh", refreshToken);

module.exports = router;
