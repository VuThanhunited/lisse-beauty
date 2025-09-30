const { body, param, query } = require("express-validator");

// User validation rules
const validateRegister = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Tên phải từ 2-50 ký tự"),

  body("email").isEmail().normalizeEmail().withMessage("Email không hợp lệ"),

  body("phone")
    .matches(/^[0-9]{10,11}$/)
    .withMessage("Số điện thoại không hợp lệ"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"),
];

const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Email không hợp lệ"),

  body("password").notEmpty().withMessage("Mật khẩu là bắt buộc"),
];

// Service validation rules
const validateService = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Tên dịch vụ phải từ 3-100 ký tự"),

  body("description")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Mô tả phải từ 10-500 ký tự"),

  body("price")
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage("Giá phải là số dương"),

  body("duration")
    .isInt({ min: 1 })
    .withMessage("Thời gian phải là số nguyên dương"),

  body("category")
    .isIn(["eyebrow", "lips", "eyeliner", "skincare", "other"])
    .withMessage("Danh mục không hợp lệ"),

  body("image").isURL().withMessage("URL hình ảnh không hợp lệ"),
];

// Feedback validation rules
const validateFeedback = [
  body("customerName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Tên khách hàng phải từ 2-50 ký tự"),

  body("customerEmail")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Email không hợp lệ"),

  body("customerPhone")
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage("Số điện thoại không hợp lệ"),

  body("serviceId").isMongoId().withMessage("ID dịch vụ không hợp lệ"),

  body("service").trim().notEmpty().withMessage("Tên dịch vụ là bắt buộc"),

  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Đánh giá phải từ 1-5 sao"),

  body("comment")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bình luận không được vượt quá 500 ký tự"),

  body("type")
    .optional()
    .isIn(["text", "video", "image"])
    .withMessage("Loại đánh giá không hợp lệ"),
];

// Booking validation rules
const validateBooking = [
  body("customerInfo.name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Tên khách hàng phải từ 2-50 ký tự"),

  body("customerInfo.email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Email không hợp lệ"),

  body("customerInfo.phone")
    .matches(/^[0-9]{10,11}$/)
    .withMessage("Số điện thoại không hợp lệ"),

  body("serviceId").isMongoId().withMessage("ID dịch vụ không hợp lệ"),

  body("appointmentDate")
    .isISO8601()
    .toDate()
    .withMessage("Ngày hẹn không hợp lệ"),

  body("appointmentTime")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Giờ hẹn không hợp lệ (HH:MM)"),

  body("customerInfo.age")
    .optional()
    .isInt({ min: 16, max: 100 })
    .withMessage("Tuổi phải từ 16-100"),

  body("customerInfo.gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Giới tính không hợp lệ"),
];

// Parameter validation
const validateObjectId = [
  param("id").isMongoId().withMessage("ID không hợp lệ"),
];

// Query validation
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Trang phải là số nguyên dương"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit phải từ 1-100"),
];

module.exports = {
  validateRegister,
  validateLogin,
  validateService,
  validateFeedback,
  validateBooking,
  validateObjectId,
  validatePagination,
};
