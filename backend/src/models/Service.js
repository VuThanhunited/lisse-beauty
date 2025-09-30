const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên dịch vụ là bắt buộc"],
      trim: true,
      maxlength: [100, "Tên dịch vụ không được vượt quá 100 ký tự"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Mô tả dịch vụ là bắt buộc"],
      maxlength: [500, "Mô tả không được vượt quá 500 ký tự"],
    },
    fullDescription: {
      type: String,
      maxlength: [2000, "Mô tả chi tiết không được vượt quá 2000 ký tự"],
    },
    image: {
      type: String,
      required: [true, "Hình ảnh dịch vụ là bắt buộc"],
    },
    images: [
      {
        url: String,
        alt: String,
        isPrimary: { type: Boolean, default: false },
      },
    ],
    price: {
      type: Number,
      required: [true, "Giá dịch vụ là bắt buộc"],
      min: [0, "Giá không được âm"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Giá gốc không được âm"],
    },
    duration: {
      type: Number, // in minutes
      required: [true, "Thời gian thực hiện là bắt buộc"],
      min: [1, "Thời gian phải lớn hơn 0"],
    },
    category: {
      type: String,
      required: [true, "Danh mục dịch vụ là bắt buộc"],
      enum: ["eyebrow", "lips", "eyeliner", "skincare", "other"],
    },
    features: [String], // Các đặc điểm nổi bật
    benefits: [String], // Lợi ích
    process: [
      {
        step: Number,
        title: String,
        description: String,
        duration: Number, // in minutes
      },
    ],
    requirements: [String], // Yêu cầu trước khi thực hiện
    aftercare: [String], // Chăm sóc sau thực hiện
    isActive: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    bookingCount: {
      type: Number,
      default: 0,
    },
    tags: [String],
    metaData: {
      title: String,
      description: String,
      keywords: [String],
    },
    detailUrl: String, // For frontend routing
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
serviceSchema.index({ slug: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ isPopular: 1 });
serviceSchema.index({ isFeatured: 1 });
serviceSchema.index({ "rating.average": -1 });
serviceSchema.index({ bookingCount: -1 });
serviceSchema.index({ createdAt: -1 });

// Virtual for discount percentage
serviceSchema.virtual("discountPercentage").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  return 0;
});

// Virtual for formatted price
serviceSchema.virtual("formattedPrice").get(function () {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(this.price);
});

// Pre-save middleware to generate slug
serviceSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});

// Static method to find active services
serviceSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

// Static method to find popular services
serviceSchema.statics.findPopular = function () {
  return this.find({ isActive: true, isPopular: true });
};

// Static method to find featured services
serviceSchema.statics.findFeatured = function () {
  return this.find({ isActive: true, isFeatured: true });
};

module.exports = mongoose.model("Service", serviceSchema);
