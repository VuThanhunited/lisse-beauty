const express = require("express");
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const {
  validatePagination,
  validateObjectId,
} = require("../middleware/validation");

const router = express.Router();

// @route   GET /api/services
// @desc    Get all services with pagination and filtering
// @access  Public
router.get("/", validatePagination, getServices);

// @route   GET /api/services/:id
// @desc    Get service by ID
// @access  Public
router.get("/:id", validateObjectId, getServiceById);

// @route   POST /api/services
// @desc    Create new service
// @access  Private
router.post("/", createService);

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Private
router.put("/:id", validateObjectId, updateService);

// @route   DELETE /api/services/:id
// @desc    Delete service
// @access  Private
router.delete("/:id", validateObjectId, deleteService);

module.exports = router;
