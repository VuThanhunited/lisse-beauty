const express = require("express");
const router = express.Router();
const {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
} = require("../controllers/bookingController");

// @route   GET /api/bookings
// @desc    Get all bookings with pagination and filtering
// @access  Public (for admin)
router.get("/", getBookings);

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Public (for admin)
router.get("/:id", getBookingById);

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Public
router.post("/", createBooking);

// @route   PUT /api/bookings/:id
// @desc    Update booking
// @access  Private (Admin)
router.put("/:id", updateBooking);

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Private (Admin)
router.delete("/:id", deleteBooking);

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status
// @access  Private (Admin)
router.patch("/:id/status", updateBookingStatus);

module.exports = router;
