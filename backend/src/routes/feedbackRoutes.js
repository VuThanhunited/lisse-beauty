const express = require("express");
const {
  getFeedbacks,
  getFeedbackById,
  createFeedback,
  getFeaturedFeedbacks,
  getFeedbackStats,
} = require("../controllers/feedbackController");
const { optionalAuth } = require("../middleware/auth");
const {
  validateFeedback,
  validateObjectId,
  validatePagination,
} = require("../middleware/validation");

const router = express.Router();

// @route   GET /api/feedbacks
// @desc    Get all approved feedbacks with filtering and pagination
// @access  Public
router.get("/", validatePagination, getFeedbacks);

// @route   GET /api/feedbacks/featured
// @desc    Get featured feedbacks
// @access  Public
router.get("/featured", getFeaturedFeedbacks);

// @route   GET /api/feedbacks/stats
// @desc    Get feedback statistics
// @access  Public
router.get("/stats", getFeedbackStats);

// @route   POST /api/feedbacks
// @desc    Create new feedback
// @access  Public (with optional auth)
router.post("/", optionalAuth, validateFeedback, createFeedback);

// @route   GET /api/feedbacks/:id
// @desc    Get feedback by ID
// @access  Public
router.get("/:id", validateObjectId, getFeedbackById);

module.exports = router;
