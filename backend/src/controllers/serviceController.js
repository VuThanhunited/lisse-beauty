const { Service } = require("../models");
const { validationResult } = require("express-validator");
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
      isActive,
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

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
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

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID dịch vụ không hợp lệ",
      });
    }

    const service = await Service.findById(id).lean();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ",
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Error in getServiceById:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin dịch vụ",
      error: error.message,
    });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private
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

    // Auto-generate slug from name
    const generateSlug = (name) => {
      return name
        .toLowerCase()
        .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
        .replace(/[èéẹẻẽêềếệểễ]/g, "e")
        .replace(/[ìíịỉĩ]/g, "i")
        .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
        .replace(/[ùúụủũưừứựửữ]/g, "u")
        .replace(/[ỳýỵỷỹ]/g, "y")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim("-");
    };

    // Process duration - extract number from string like "60 phút"
    const processDuration = (duration) => {
      if (typeof duration === "number") return duration;
      if (typeof duration === "string") {
        const match = duration.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      }
      return 0;
    };

    // Map Vietnamese categories to English enum values
    const mapCategory = (category) => {
      const categoryMap = {
        "Chân mày": "eyebrow",
        Môi: "lips",
        "Mí mắt": "eyeliner",
        "Chăm sóc da": "skincare",
        Khác: "other",
      };
      return categoryMap[category] || "other";
    };

    // Prepare service data
    const serviceData = {
      ...req.body,
      slug: req.body.slug || generateSlug(req.body.name),
      createdBy: new mongoose.Types.ObjectId(), // Default ObjectId for demo
      image: req.body.image || "/uploads/services/default-service.jpg", // Default image
      duration: processDuration(req.body.duration),
      category: mapCategory(req.body.category),
    };

    const service = await Service.create(serviceData);

    return res.status(201).json({
      success: true,
      message: "Tạo dịch vụ thành công",
      data: service,
    });
  } catch (error) {
    console.error("Error in createService:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo dịch vụ",
      error: error.message,
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID dịch vụ không hợp lệ",
      });
    }

    // Process duration - extract number from string like "60 phút"
    const processDuration = (duration) => {
      if (typeof duration === "number") return duration;
      if (typeof duration === "string") {
        const match = duration.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      }
      return 0;
    };

    // Map Vietnamese categories to English enum values
    const mapCategory = (category) => {
      const categoryMap = {
        "Chân mày": "eyebrow",
        Môi: "lips",
        "Mí mắt": "eyeliner",
        "Chăm sóc da": "skincare",
        Khác: "other",
      };
      return categoryMap[category] || category; // Return original if not found
    };

    // Process update data
    const updateData = { ...req.body };
    if (req.body.duration) {
      updateData.duration = processDuration(req.body.duration);
    }
    if (req.body.category) {
      updateData.category = mapCategory(req.body.category);
    }

    const service = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật dịch vụ thành công",
      data: service,
    });
  } catch (error) {
    console.error("Error in updateService:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật dịch vụ",
      error: error.message,
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID dịch vụ không hợp lệ",
      });
    }

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dịch vụ",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Xóa dịch vụ thành công",
    });
  } catch (error) {
    console.error("Error in deleteService:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa dịch vụ",
      error: error.message,
    });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
