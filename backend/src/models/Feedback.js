const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Tên khách hàng là bắt buộc"],
      trim: true,
      maxlength: [50, "Tên không được vượt quá 50 ký tự"],
    },
    customerEmail: {
      type: String,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Email không hợp lệ",
      ],
    },
    customerPhone: {
      type: String,
      match: [/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Dịch vụ là bắt buộc"],
    },
    service: {
      type: String,
      required: [true, "Tên dịch vụ là bắt buộc"],
    },
    rating: {
      type: Number,
      required: [true, "Đánh giá là bắt buộc"],
      min: [1, "Đánh giá tối thiểu là 1 sao"],
      max: [5, "Đánh giá tối đa là 5 sao"],
    },
    comment: {
      type: String,
      maxlength: [500, "Bình luận không được vượt quá 500 ký tự"],
    },
    type: {
      type: String,
      enum: ["text", "video", "image"],
      default: "text",
    },
    media: {
      url: String,
      type: String, // 'image' or 'video'
      thumbnail: String, // for videos
    },
    avatar: {
      type: String,
      default: function () {
        const randomNum = Math.floor(Math.random() * 70) + 1;
        return `https://i.pravatar.cc/150?img=${randomNum}`;
      },
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      default: function () {
        const now = new Date();
        return `${now.getDate()} - Tháng ${now.getMonth() + 1}`;
      },
    },
    actualDate: {
      type: Date,
      default: Date.now,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    moderatorNotes: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
feedbackSchema.index({ serviceId: 1 });
feedbackSchema.index({ userId: 1 });
feedbackSchema.index({ rating: -1 });
feedbackSchema.index({ isApproved: 1 });
feedbackSchema.index({ isPublic: 1 });
feedbackSchema.index({ isFeatured: 1 });
feedbackSchema.index({ actualDate: -1 });

// Virtual for star display
feedbackSchema.virtual("starDisplay").get(function () {
  return "⭐".repeat(this.rating);
});

// Virtual for time ago
feedbackSchema.virtual("timeAgo").get(function () {
  const now = new Date();
  const diff = now - this.actualDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Hôm nay";
  if (days === 1) return "Hôm qua";
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
  return `${Math.floor(days / 365)} năm trước`;
});

// Static method to find approved feedbacks
feedbackSchema.statics.findApproved = function () {
  return this.find({ isApproved: true, isPublic: true });
};

// Static method to find featured feedbacks
feedbackSchema.statics.findFeatured = function () {
  return this.find({ isApproved: true, isPublic: true, isFeatured: true });
};

// Static method to get average rating for a service
feedbackSchema.statics.getServiceRating = async function (serviceId) {
  const result = await this.aggregate([
    {
      $match: {
        serviceId: new mongoose.Types.ObjectId(serviceId),
        isApproved: true,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  return result[0] || { averageRating: 0, totalReviews: 0 };
};

// Pre-save middleware to update service rating
feedbackSchema.post("save", async function () {
  if (this.isApproved) {
    const Service = mongoose.model("Service");
    const stats = await this.constructor.getServiceRating(this.serviceId);

    await Service.findByIdAndUpdate(this.serviceId, {
      "rating.average": Math.round(stats.averageRating * 10) / 10,
      "rating.count": stats.totalReviews,
    });
  }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
