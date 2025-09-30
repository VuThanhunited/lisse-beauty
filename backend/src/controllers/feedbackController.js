const { Feedback, Service } = require("../models");
const { validationResult } = require("express-validator");

// @desc    Get all feedbacks
// @route   GET /api/feedbacks
// @access  Public
const getFeedbacks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      serviceId,
      rating,
      type,
      isFeatured,
      sortBy = "actualDate",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = { isApproved: true, isPublic: true };

    if (serviceId) {
      filter.serviceId = serviceId;
    }

    if (rating) {
      filter.rating = parseInt(rating);
    }

    if (type) {
      filter.type = type;
    }

    if (isFeatured === "true") {
      filter.isFeatured = true;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [feedbacks, total] = await Promise.all([
      Feedback.find(filter)
        .populate("serviceId", "name slug category")
        .populate("userId", "name avatar")
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
    console.error("Get feedbacks error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

// @desc    Get feedback by ID
// @route   GET /api/feedbacks/:id
// @access  Public
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      _id: req.params.id,
      isApproved: true,
      isPublic: true,
    })
      .populate("serviceId", "name slug category")
      .populate("userId", "name avatar");

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá",
      });
    }

    res.json({
      success: true,
      data: { feedback },
    });
  } catch (error) {
    console.error("Get feedback by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

// @desc    Create new feedback
// @route   POST /api/feedbacks
// @access  Public
const createFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: errors.array(),
      });
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      service,
      rating,
      comment,
      type = "text",
    } = req.body;

    // Verify service exists
    const serviceExists = await Service.findById(serviceId);
    if (!serviceExists) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ",
      });
    }

    // Create feedback
    const feedback = await Feedback.create({
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      service,
      rating,
      comment,
      type,
      userId: req.user ? req.user.userId : null,
    });

    // Populate the created feedback
    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate("serviceId", "name slug category")
      .populate("userId", "name avatar");

    res.status(201).json({
      success: true,
      message: "Đánh giá đã được gửi và đang chờ duyệt",
      data: { feedback: populatedFeedback },
    });
  } catch (error) {
    console.error("Create feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

// @desc    Get featured feedbacks
// @route   GET /api/feedbacks/featured
// @access  Public
const getFeaturedFeedbacks = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const feedbacks = await Feedback.findFeatured()
      .populate("serviceId", "name slug category")
      .populate("userId", "name avatar")
      .sort({ actualDate: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: { feedbacks },
    });
  } catch (error) {
    console.error("Get featured feedbacks error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

// @desc    Get feedback statistics
// @route   GET /api/feedbacks/stats
// @access  Public
const getFeedbackStats = async (req, res) => {
  try {
    const { serviceId } = req.query;

    let matchStage = { isApproved: true };
    if (serviceId) {
      matchStage.serviceId = new mongoose.Types.ObjectId(serviceId);
    }

    const stats = await Feedback.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalFeedbacks: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
      {
        $project: {
          totalFeedbacks: 1,
          averageRating: { $round: ["$averageRating", 1] },
          ratingDistribution: {
            1: {
              $size: {
                $filter: {
                  input: "$ratingDistribution",
                  cond: { $eq: ["$$this", 1] },
                },
              },
            },
            2: {
              $size: {
                $filter: {
                  input: "$ratingDistribution",
                  cond: { $eq: ["$$this", 2] },
                },
              },
            },
            3: {
              $size: {
                $filter: {
                  input: "$ratingDistribution",
                  cond: { $eq: ["$$this", 3] },
                },
              },
            },
            4: {
              $size: {
                $filter: {
                  input: "$ratingDistribution",
                  cond: { $eq: ["$$this", 4] },
                },
              },
            },
            5: {
              $size: {
                $filter: {
                  input: "$ratingDistribution",
                  cond: { $eq: ["$$this", 5] },
                },
              },
            },
          },
        },
      },
    ]);

    const result = stats[0] || {
      totalFeedbacks: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };

    res.json({
      success: true,
      data: { stats: result },
    });
  } catch (error) {
    console.error("Get feedback stats error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

module.exports = {
  getFeedbacks,
  getFeedbackById,
  createFeedback,
  getFeaturedFeedbacks,
  getFeedbackStats,
};
