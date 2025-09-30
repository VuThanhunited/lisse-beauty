const { Service } = require("../models");
const { validationResult } = require("express-validator");
const MockDatabase = require("../services/mockDatabase");
const mongoose = require("mongoose");

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    console.log("🔄 Getting services from MongoDB");
    
    const {
      page = 1,
      limit = 10,
      current = 1,
      pageSize = 10,
      category,
      search,
      name,
    } = req.query;

    // Use current/pageSize if available, otherwise use page/limit
    const pageNum = parseInt(current) || parseInt(page);
    const limitNum = parseInt(pageSize) || parseInt(limit);

    let query = {};

    // Add search filters
    if (search || name) {
      const searchTerm = search || name;
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      query.category = category;
    }

    const skip = (pageNum - 1) * limitNum;

    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Service.countDocuments(query);

    console.log(`Found ${services.length} services out of ${total} total`);

    return res.status(200).json({
      success: true,
      data: services,
      total: total,
      pagination: {
        current: pageNum,
        pageSize: limitNum,
        total: total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error in getServices:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách dịch vụ",
      error: error.message,
    });
  }
};
      isPopular,
      isFeatured,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (isPopular === "true") {
      filter.isPopular = true;
    }

    if (isFeatured === "true") {
      filter.isFeatured = true;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [services, total] = await Promise.all([
      Service.find(filter)
        .populate("createdBy", "name email")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Service.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        services,
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
    console.error("Get services error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("createdBy", "name email");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ",
      });
    }

    res.json({
      success: true,
      data: { service },
    });
  } catch (error) {
    console.error("Get service by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

// @desc    Get service by slug
// @route   GET /api/services/slug/:slug
// @access  Public
const getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate("createdBy", "name email");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ",
      });
    }

    res.json({
      success: true,
      data: { service },
    });
  } catch (error) {
    console.error("Get service by slug error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

// @desc    Get popular services
// @route   GET /api/services/popular
// @access  Public
const getPopularServices = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const services = await Service.findPopular()
      .populate("createdBy", "name email")
      .sort({ bookingCount: -1, "rating.average": -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: { services },
    });
  } catch (error) {
    console.error("Get popular services error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

// @desc    Get featured services
// @route   GET /api/services/featured
// @access  Public
const getFeaturedServices = async (req, res) => {
  try {
    const { limit = 4 } = req.query;

    const services = await Service.findFeatured()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: { services },
    });
  } catch (error) {
    console.error("Get featured services error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

// @desc    Get service categories
// @route   GET /api/services/categories
// @access  Public
const getServiceCategories = async (req, res) => {
  try {
    const categories = await Service.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgRating: { $avg: "$rating.average" },
          avgPrice: { $avg: "$price" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const categoryMap = {
      eyebrow: "Chân mày",
      lips: "Môi",
      eyeliner: "Kẻ mắt",
      skincare: "Chăm sóc da",
      other: "Khác",
    };

    const formattedCategories = categories.map((cat) => ({
      value: cat._id,
      label: categoryMap[cat._id] || cat._id,
      count: cat.count,
      avgRating: Math.round(cat.avgRating * 10) / 10,
      avgPrice: cat.avgPrice,
    }));

    res.json({
      success: true,
      data: { categories: formattedCategories },
    });
  } catch (error) {
    console.error("Get service categories error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

module.exports = {
  getServices,
  getServiceById,
  getServiceBySlug,
  getPopularServices,
  getFeaturedServices,
  getServiceCategories,
};
