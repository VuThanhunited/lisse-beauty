const Booking = require("../models/Booking");
const asyncHandler = require("express-async-handler");

// @desc    Get all bookings with pagination and filtering
// @route   GET /api/admin/bookings
// @access  Private (Admin only)
const getBookings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search = "",
    status,
    serviceId,
    dateFrom,
    dateTo,
  } = req.query;

  const skip = (page - 1) * pageSize;
  let query = {}; // Remove isDeleted filter to show all bookings

  // Apply filters
  if (search) {
    query.$or = [
      { "customerInfo.name": { $regex: search, $options: "i" } },
      { "customerInfo.email": { $regex: search, $options: "i" } },
      { "customerInfo.phone": { $regex: search, $options: "i" } },
    ];
  }

  if (status) {
    query.status = status;
  }

  if (serviceId) {
    query.serviceId = serviceId;
  }

  if (dateFrom || dateTo) {
    query.appointmentDate = {};
    if (dateFrom) {
      query.appointmentDate.$gte = new Date(dateFrom);
    }
    if (dateTo) {
      query.appointmentDate.$lte = new Date(dateTo);
    }
  }

  const bookings = await Booking.find(query)
    .populate("serviceId", "name price duration")
    .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
    .skip(skip)
    .limit(Number(pageSize))
    .select("-__v");

  const total = await Booking.countDocuments(query);

  res.json({
    success: true,
    data: {
      bookings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / pageSize),
        totalItems: total,
        pageSize: Number(pageSize),
      },
    },
  });
});

// @desc    Get booking by ID
// @route   GET /api/admin/bookings/:id
// @access  Private (Admin only)
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("serviceId", "name price duration")
    .select("-__v");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  res.json({
    success: true,
    data: booking,
  });
});

// @desc    Create new booking
// @route   POST /api/admin/bookings
// @access  Private (Admin only)
const createBooking = asyncHandler(async (req, res) => {
  const {
    customerInfo,
    serviceId,
    appointmentDate,
    appointmentTime,
    specialRequests,
    status = "pending",
  } = req.body;

  // Validate required fields
  if (
    !customerInfo?.name ||
    !customerInfo?.email ||
    !customerInfo?.phone ||
    !serviceId ||
    !appointmentDate ||
    !appointmentTime
  ) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Generate booking ID
  const bookingId = `BK${Date.now()}`;

  // Check if appointment slot is available
  const existingBooking = await Booking.findOne({
    serviceId,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    status: { $in: ["pending", "confirmed"] },
  });

  if (existingBooking) {
    res.status(400);
    throw new Error("This time slot is already booked");
  }

  const booking = await Booking.create({
    bookingId,
    customerInfo,
    serviceId,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    specialRequests,
    status,
    createdBy: new (require("mongoose").Types.ObjectId)(), // Default ObjectId for demo
  });

  const populatedBooking = await Booking.findById(booking._id).populate(
    "serviceId",
    "name price duration"
  );

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: populatedBooking,
  });
});

// @desc    Update booking
// @route   PUT /api/admin/bookings/:id
// @access  Private (Admin only)
const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const {
    customerInfo,
    serviceId,
    appointmentDate,
    appointmentTime,
    specialRequests,
    status,
  } = req.body;

  // Check if appointment slot is available (exclude current booking)
  if (serviceId && appointmentDate && appointmentTime) {
    const existingBooking = await Booking.findOne({
      _id: { $ne: req.params.id },
      serviceId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      res.status(400);
      throw new Error("This time slot is already booked");
    }
  }

  // Update fields
  if (customerInfo)
    booking.customerInfo = { ...booking.customerInfo, ...customerInfo };
  if (serviceId) booking.serviceId = serviceId;
  if (appointmentDate) booking.appointmentDate = new Date(appointmentDate);
  if (appointmentTime) booking.appointmentTime = appointmentTime;
  if (specialRequests !== undefined) booking.specialRequests = specialRequests;
  if (status) booking.status = status;

  booking.updatedBy = req.user._id;
  booking.updatedAt = new Date();

  const updatedBooking = await booking.save();
  const populatedBooking = await Booking.findById(updatedBooking._id).populate(
    "serviceId",
    "name price duration"
  );

  res.json({
    success: true,
    message: "Booking updated successfully",
    data: populatedBooking,
  });
});

// @desc    Delete booking (hard delete)
// @route   DELETE /api/admin/bookings/:id
// @access  Private (Admin only)
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Hard delete - remove completely from database
  await Booking.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Booking deleted successfully",
  });
});

// @desc    Update booking status
// @route   PATCH /api/admin/bookings/:id/status
// @access  Private (Admin only)
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (
    !status ||
    !["pending", "confirmed", "completed", "cancelled", "no-show"].includes(
      status
    )
  ) {
    res.status(400);
    throw new Error("Please provide a valid status");
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  booking.status = status;
  booking.updatedBy = req.user._id;
  booking.updatedAt = new Date();

  await booking.save();

  res.json({
    success: true,
    message: `Booking status updated to ${status}`,
    data: { status: booking.status },
  });
});

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
};
