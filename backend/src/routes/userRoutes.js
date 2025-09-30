const express = require("express");
const { User } = require("../models");
const { protect, ownerOrAdmin } = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validation");

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "dateOfBirth",
      "gender",
      "address",
      "preferences",
    ];
    const updateData = {};

    // Filter allowed fields
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: { user },
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
});

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu hiện tại và mật khẩu mới là bắt buộc",
      });
    }

    // Get user with password
    const user = await User.findById(req.user.userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Check current password
    const isCurrentPasswordCorrect = await user.comparePassword(
      currentPassword
    );

    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu hiện tại không đúng",
      });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account (soft delete)
// @access  Private
router.delete("/account", protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { isActive: false },
      { new: true }
    ).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    res.json({
      success: true,
      message: "Tài khoản đã được vô hiệu hóa thành công",
    });
  } catch (error) {
    console.error("Delete user account error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
});

module.exports = router;
