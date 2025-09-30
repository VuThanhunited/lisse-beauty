const express = require("express");
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const {
  validateObjectId,
  validatePagination,
} = require("../middleware/validation");

const router = express.Router();

// @route   GET /api/services
// @desc    Get all services with filtering and pagination
// @access  Public
router.get("/", validatePagination, getServices);

// @route   GET /api/services/popular
// @desc    Get popular services
// @access  Public
router.get("/popular", getPopularServices);

// @route   GET /api/services/featured
// @desc    Get featured services
// @access  Public
router.get("/featured", getFeaturedServices);

// @route   GET /api/services/categories
// @desc    Get service categories with statistics
// @access  Public
router.get("/categories", getServiceCategories);

// @route   GET /api/services/slug/:slug
// @desc    Get service by slug
// @access  Public
router.get("/slug/:slug", getServiceBySlug);

// @route   GET /api/services/:id
// @desc    Get service by ID
// @access  Public
router.get("/:id", validateObjectId, getServiceById);

module.exports = router;
