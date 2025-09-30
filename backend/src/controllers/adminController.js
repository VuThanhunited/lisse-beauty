const { User, Service, Feedback, Booking } = require("../models");
const { validationResult } = require("express-validator");

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // Get various statistics
    const [
      totalUsers,
      totalServices,
      totalBookings,
      todayBookings,
      monthlyBookings,
      pendingFeedbacks,
      approvedFeedbacks,
      totalRevenue,
      monthlyRevenue,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Service.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Booking.countDocuments({
        appointmentDate: { $gte: startOfToday, $lte: endOfToday },
      }),
      Booking.countDocuments({
        appointmentDate: { $gte: startOfMonth, $lte: endOfMonth },
      }),
      Feedback.countDocuments({ isApproved: false }),
      Feedback.countDocuments({ isApproved: true }),
      Booking.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Booking.aggregate([
        {
          $match: {
            status: "completed",
            completedAt: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
    ]);

    // Get booking status distribution
    const bookingStats = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get popular services
    const popularServices = await Service.find({ isActive: true })
      .sort({ bookingCount: -1, "rating.average": -1 })
      .limit(5)
      .select("name bookingCount rating.average");

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate("serviceId", "name")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("bookingId customerInfo appointmentDate status price");

    const stats = {
      overview: {
        totalUsers,
        totalServices,
        totalBookings,
        todayBookings,
        monthlyBookings,
        pendingFeedbacks,
        approvedFeedbacks,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
      },
      bookingStatusDistribution: bookingStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      popularServices,
      recentBookings,
    };

    res.json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select("-password -refreshToken"),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

// @desc    Get all services for admin with pagination and filtering
// @route   GET /api/admin/services
// @access  Private (Admin only)
const getServices = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search = "",
      status,
      category,
    } = req.query;

    const skip = (page - 1) * pageSize;
    let query = { isDeleted: { $ne: true } };

    // Apply filters
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.isActive = status === "active";
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    const services = await Service.find(query)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(Number(pageSize))
      .select("-__v");

    const total = await Service.countDocuments(query);

    res.json({
      success: true,
      data: {
        services,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / pageSize),
          totalItems: total,
          pageSize: Number(pageSize),
        },
      },
    });
  } catch (error) {
    console.error("Error in getServices:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get service by ID
// @route   GET /api/admin/services/:id
// @access  Private (Admin only)
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    }).select("-__v");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Error in getServiceById:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Toggle service status (active/inactive)
// @route   PATCH /api/admin/services/:id/status
// @access  Private (Admin only)
const toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    service.isActive = !service.isActive;
    service.updatedBy = req.user._id;
    service.updatedAt = new Date();

    await service.save();

    res.json({
      success: true,
      message: `Service ${
        service.isActive ? "activated" : "deactivated"
      } successfully`,
      data: { isActive: service.isActive },
    });
  } catch (error) {
    console.error("Error in toggleServiceStatus:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Create new service
// @route   POST /api/admin/services
// @access  Private (Admin only)
const createService = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: errors.array(),
      });
    }

    const serviceData = {
      ...req.body,
      createdBy: req.user.userId,
    };

    const service = await Service.create(serviceData);

    const populatedService = await Service.findById(service._id).populate(
      "createdBy",
      "name email"
    );

    res.status(201).json({
      success: true,
      message: "Dịch vụ đã được tạo thành công",
      data: { service: populatedService },
    });
  } catch (error) {
    console.error("Create service error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Tên dịch vụ đã tồn tại",
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

// @desc    Update service
// @route   PUT /api/admin/services/:id
// @access  Private (Admin only)
const updateService = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: errors.array(),
      });
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ",
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user.userId,
    };

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("createdBy updatedBy", "name email");

    res.json({
      success: true,
      message: "Dịch vụ đã được cập nhật thành công",
      data: { service: updatedService },
    });
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/admin/services/:id
// @access  Private (Admin only)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ",
      });
    }

    // Soft delete by setting isActive to false
    await Service.findByIdAndUpdate(req.params.id, {
      isActive: false,
      updatedBy: req.user.userId,
    });

    res.json({
      success: true,
      message: "Dịch vụ đã được xóa thành công",
    });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

// @desc    Get pending feedbacks for approval
// @route   GET /api/admin/feedbacks/pending
// @access  Private (Admin only)
const getPendingFeedbacks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = { isApproved: false };
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [feedbacks, total] = await Promise.all([
      Feedback.find(filter)
        .populate("serviceId", "name slug")
        .populate("userId", "name email")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Feedback.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        feedbacks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get pending feedbacks error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

// @desc    Approve or reject feedback
// @route   PUT /api/admin/feedbacks/:id/status
// @access  Private (Admin only)
const updateFeedbackStatus = async (req, res) => {
  try {
    const { isApproved, isFeatured, moderatorNotes } = req.body;

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá",
      });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        isApproved,
        isFeatured: isFeatured || false,
        moderatorNotes,
        approvedBy: req.user.userId,
        approvedAt: isApproved ? new Date() : null,
      },
      { new: true }
    )
      .populate("serviceId", "name slug")
      .populate("userId", "name email");

    res.json({
      success: true,
      message: `Đánh giá đã được ${isApproved ? "duyệt" : "từ chối"}`,
      data: { feedback: updatedFeedback },
    });
  } catch (error) {
    console.error("Update feedback status error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  getPendingFeedbacks,
  updateFeedbackStatus,
};
