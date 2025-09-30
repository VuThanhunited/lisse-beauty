const CustomerStory = require("../models/CustomerStory");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");

// @desc    Get all customer stories with pagination and filtering
// @route   GET /api/admin/customer-stories
// @access  Private (Admin only)
const getCustomerStories = asyncHandler(async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search = "",
    status,
    rating,
    treatment,
  } = req.query;

  const skip = (page - 1) * pageSize;
  let query = {}; // Remove isDeleted filter to show all items

  // Apply filters
  if (search) {
    query.$or = [
      { customerName: { $regex: search, $options: "i" } },
      { story: { $regex: search, $options: "i" } },
    ];
  }

  if (status) {
    query.isPublished = status === "published";
  }

  if (rating) {
    query.rating = Number(rating);
  }

  if (treatment) {
    query.treatment = { $regex: treatment, $options: "i" };
  }

  const stories = await CustomerStory.find(query)
    .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
    .skip(skip)
    .limit(Number(pageSize))
    .select("-__v");

  const total = await CustomerStory.countDocuments(query);

  res.json({
    success: true,
    data: {
      stories,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / pageSize),
        totalItems: total,
        pageSize: Number(pageSize),
      },
    },
  });
});

// @desc    Get customer story by ID
// @route   GET /api/admin/customer-stories/:id
// @access  Private (Admin only)
const getCustomerStoryById = asyncHandler(async (req, res) => {
  const story = await CustomerStory.findById(req.params.id).select("-__v");

  if (!story) {
    res.status(404);
    throw new Error("Customer story not found");
  }

  res.json({
    success: true,
    data: story,
  });
});

// @desc    Create new customer story
// @route   POST /api/customer-stories
// @access  Private (Admin only)
const createCustomerStory = asyncHandler(async (req, res) => {
  try {
    console.log("Creating customer story with data:", req.body);
    console.log("Files:", req.files);

    const {
      customerName,
      story,
      rating,
      treatment,
      isPublished = true,
    } = req.body;

    // Validate required fields
    if (!customerName || !story || !rating || !treatment) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
        missingFields: {
          customerName: !customerName,
          story: !story,
          rating: !rating,
          treatment: !treatment,
        },
      });
    }

    const storyData = {
      customerName,
      story,
      rating: Number(rating),
      treatment,
      isPublished: Boolean(isPublished),
      createdBy: new (require("mongoose").Types.ObjectId)(), // Default ObjectId for demo
    };

    // Handle image uploads if present
    if (req.files) {
      if (req.files.beforeImage) {
        storyData.beforeImage = req.files.beforeImage[0].path;
      }
      if (req.files.afterImage) {
        storyData.afterImage = req.files.afterImage[0].path;
      }
    }

    const customerStory = await CustomerStory.create(storyData);

    res.status(201).json({
      success: true,
      message: "Customer story created successfully",
      data: customerStory,
    });
  } catch (error) {
    console.error("Error creating customer story:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo câu chuyện khách hàng",
      error: error.message,
    });
  }
});

// @desc    Update customer story
// @route   PUT /api/admin/customer-stories/:id
// @access  Private (Admin only)
const updateCustomerStory = asyncHandler(async (req, res) => {
  const story = await CustomerStory.findOne({
    _id: req.params.id,
    isDeleted: { $ne: true },
  });

  if (!story) {
    res.status(404);
    throw new Error("Customer story not found");
  }

  const {
    customerName,
    story: storyText,
    rating,
    treatment,
    isPublished,
  } = req.body;

  // Update fields
  if (customerName) story.customerName = customerName;
  if (storyText) story.story = storyText;
  if (rating !== undefined) story.rating = Number(rating);
  if (treatment) story.treatment = treatment;
  if (isPublished !== undefined) story.isPublished = Boolean(isPublished);

  // Handle image uploads
  if (req.files) {
    if (req.files.beforeImage) {
      // Delete old image if exists
      if (story.beforeImage && fs.existsSync(story.beforeImage)) {
        fs.unlinkSync(story.beforeImage);
      }
      story.beforeImage = req.files.beforeImage[0].path;
    }
    if (req.files.afterImage) {
      // Delete old image if exists
      if (story.afterImage && fs.existsSync(story.afterImage)) {
        fs.unlinkSync(story.afterImage);
      }
      story.afterImage = req.files.afterImage[0].path;
    }
  }

  story.updatedBy = new (require("mongoose").Types.ObjectId)(); // Default ObjectId for demo
  story.updatedAt = new Date();

  const updatedStory = await story.save();

  res.json({
    success: true,
    message: "Customer story updated successfully",
    data: updatedStory,
  });
});

// @desc    Delete customer story (hard delete)
// @route   DELETE /api/admin/customer-stories/:id
// @access  Private (Admin only)
const deleteCustomerStory = asyncHandler(async (req, res) => {
  const story = await CustomerStory.findById(req.params.id);

  if (!story) {
    res.status(404);
    throw new Error("Customer story not found");
  }

  // Hard delete - remove completely from database
  await CustomerStory.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Customer story deleted successfully",
  });
});

// @desc    Toggle customer story status (published/unpublished)
// @route   PATCH /api/admin/customer-stories/:id/status
// @access  Private (Admin only)
const toggleCustomerStoryStatus = asyncHandler(async (req, res) => {
  const story = await CustomerStory.findOne({
    _id: req.params.id,
    isDeleted: { $ne: true },
  });

  if (!story) {
    res.status(404);
    throw new Error("Customer story not found");
  }

  story.isPublished = !story.isPublished;
  story.updatedBy = req.user._id;
  story.updatedAt = new Date();

  await story.save();

  res.json({
    success: true,
    message: `Customer story ${
      story.isPublished ? "published" : "unpublished"
    } successfully`,
    data: { isPublished: story.isPublished },
  });
});

// @desc    Get featured customer stories only
// @route   GET /api/customer-stories/featured
// @access  Public
const getFeaturedCustomerStories = asyncHandler(async (req, res) => {
  const stories = await CustomerStory.find({
    isPublished: true,
  })
    .sort({ createdAt: -1 })
    .select("-__v");

  res.json({
    success: true,
    data: {
      stories,
      total: stories.length,
    },
  });
});

module.exports = {
  getCustomerStories,
  getCustomerStoryById,
  createCustomerStory,
  updateCustomerStory,
  deleteCustomerStory,
  toggleCustomerStoryStatus,
  getFeaturedCustomerStories,
};
