const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Protect routes - Require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Get token from cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Không có quyền truy cập, vui lòng đăng nhập",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.userId).select(
        "-password -refreshToken"
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Tài khoản đã bị vô hiệu hóa",
        });
      }

      // Add user to request object
      req.user = {
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      };

      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server, vui lòng thử lại",
    });
  }
};

// Optional authentication - Don't require authentication but add user if token is valid
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Get token from cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const user = await User.findById(decoded.userId).select(
          "-password -refreshToken"
        );

        if (user && user.isActive) {
          // Add user to request object
          req.user = {
            userId: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
          };
        }
      } catch (error) {
        // Invalid token, but continue without user
        console.log("Invalid token in optional auth:", error.message);
      }
    }

    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next();
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền thực hiện hành động này",
      });
    }

    next();
  };
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Không có quyền truy cập",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Chỉ admin mới có quyền truy cập",
    });
  }

  next();
};

// Check if user owns the resource or is admin
const ownerOrAdmin = (resourceUserField = "userId") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    // Admin can access everything
    if (req.user.role === "admin") {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId =
      req.body[resourceUserField] || req.params[resourceUserField];

    if (
      resourceUserId &&
      resourceUserId.toString() === req.user.userId.toString()
    ) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Bạn chỉ có thể truy cập tài nguyên của mình",
    });
  };
};

module.exports = {
  protect,
  optionalAuth,
  authorize,
  adminOnly,
  ownerOrAdmin,
};
