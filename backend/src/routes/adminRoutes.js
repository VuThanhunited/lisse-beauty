const express = require("express");
const {
  getDashboardStats,
  getUsers,
  createService,
  updateService,
  deleteService,
  getServices,
  getServiceById,
  toggleServiceStatus,
  getPendingFeedbacks,
  updateFeedbackStatus,
} = require("../controllers/adminController");
const {
  getCustomerStories,
  getCustomerStoryById,
  createCustomerStory,
  updateCustomerStory,
  deleteCustomerStory,
  toggleCustomerStoryStatus,
} = require("../controllers/customerStoryController");
const {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
} = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/auth");
const {
  validateService,
  validateObjectId,
  validatePagination,
} = require("../middleware/validation");
const upload = require("../middleware/upload");

const router = express.Router();

// Apply admin protection to all routes
router.use(protect);
router.use(adminOnly);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get("/dashboard", getDashboardStats);

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filtering
// @access  Private (Admin only)
router.get("/users", validatePagination, getUsers);

// Service management routes
// @route   GET /api/admin/services
// @desc    Get all services for admin
// @access  Private (Admin only)
router.get("/services", validatePagination, getServices);

// @route   GET /api/admin/services/:id
// @desc    Get service by ID
// @access  Private (Admin only)
router.get("/services/:id", validateObjectId, getServiceById);

// @route   POST /api/admin/services
// @desc    Create new service
// @access  Private (Admin only)
router.post("/services", validateService, createService);

// @route   PUT /api/admin/services/:id
// @desc    Update service
// @access  Private (Admin only)
router.put("/services/:id", [validateObjectId, validateService], updateService);

// @route   DELETE /api/admin/services/:id
// @desc    Delete service (soft delete)
// @access  Private (Admin only)
router.delete("/services/:id", validateObjectId, deleteService);

// @route   PATCH /api/admin/services/:id/status
// @desc    Toggle service status
// @access  Private (Admin only)
router.patch("/services/:id/status", validateObjectId, toggleServiceStatus);

// Customer Stories management routes
// @route   GET /api/admin/customer-stories
// @desc    Get all customer stories for admin
// @access  Private (Admin only)
router.get("/customer-stories", validatePagination, getCustomerStories);

// @route   GET /api/admin/customer-stories/:id
// @desc    Get customer story by ID
// @access  Private (Admin only)
router.get("/customer-stories/:id", validateObjectId, getCustomerStoryById);

// @route   POST /api/admin/customer-stories
// @desc    Create new customer story
// @access  Private (Admin only)
router.post(
  "/customer-stories",
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  createCustomerStory
);

// @route   PUT /api/admin/customer-stories/:id
// @desc    Update customer story
// @access  Private (Admin only)
router.put(
  "/customer-stories/:id",
  [
    validateObjectId,
    upload.fields([
      { name: "beforeImage", maxCount: 1 },
      { name: "afterImage", maxCount: 1 },
    ]),
  ],
  updateCustomerStory
);

// @route   DELETE /api/admin/customer-stories/:id
// @desc    Delete customer story (soft delete)
// @access  Private (Admin only)
router.delete("/customer-stories/:id", validateObjectId, deleteCustomerStory);

// @route   PATCH /api/admin/customer-stories/:id/status
// @desc    Toggle customer story status
// @access  Private (Admin only)
router.patch(
  "/customer-stories/:id/status",
  validateObjectId,
  toggleCustomerStoryStatus
);

// Booking management routes
// @route   GET /api/admin/bookings
// @desc    Get all bookings for admin
// @access  Private (Admin only)
router.get("/bookings", validatePagination, getBookings);

// @route   GET /api/admin/bookings/:id
// @desc    Get booking by ID
// @access  Private (Admin only)
router.get("/bookings/:id", validateObjectId, getBookingById);

// @route   POST /api/admin/bookings
// @desc    Create new booking
// @access  Private (Admin only)
router.post("/bookings", createBooking);

// @route   PUT /api/admin/bookings/:id
// @desc    Update booking
// @access  Private (Admin only)
router.put("/bookings/:id", validateObjectId, updateBooking);

// @route   DELETE /api/admin/bookings/:id
// @desc    Delete booking (soft delete)
// @access  Private (Admin only)
router.delete("/bookings/:id", validateObjectId, deleteBooking);

// @route   PATCH /api/admin/bookings/:id/status
// @desc    Update booking status
// @access  Private (Admin only)
router.patch("/bookings/:id/status", validateObjectId, updateBookingStatus);

// Feedback management routes
// @route   GET /api/admin/feedbacks/pending
// @desc    Get pending feedbacks for approval
// @access  Private (Admin only)
router.get("/feedbacks/pending", validatePagination, getPendingFeedbacks);

// @route   PUT /api/admin/feedbacks/:id/status
// @desc    Approve or reject feedback
// @access  Private (Admin only)
router.put("/feedbacks/:id/status", validateObjectId, updateFeedbackStatus);

module.exports = router;
