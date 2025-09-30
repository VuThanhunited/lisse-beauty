// Handle 404 - Not Found
const notFound = (req, res, next) => {
  const error = new Error(`Không tìm thấy tài nguyên - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = notFound;
