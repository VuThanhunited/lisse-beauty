// Global error handler
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error("Error:", err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Tài nguyên không tồn tại";
    error = { statusCode: 404, message };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Dữ liệu đã tồn tại";
    error = { statusCode: 400, message };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = { statusCode: 400, message };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Token không hợp lệ";
    error = { statusCode: 401, message };
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token đã hết hạn";
    error = { statusCode: 401, message };
  }

  // File upload errors
  if (err.code === "LIMIT_FILE_SIZE") {
    const message = "File quá lớn";
    error = { statusCode: 400, message };
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    const message = "Loại file không được hỗ trợ";
    error = { statusCode: 400, message };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Lỗi server",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
