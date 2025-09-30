const mongoose = require("mongoose");

const customerStorySchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: [100, "Customer name cannot exceed 100 characters"],
    },
    story: {
      type: String,
      required: [true, "Story content is required"],
      maxlength: [1000, "Story cannot exceed 1000 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    treatment: {
      type: String,
      required: [true, "Treatment is required"],
      trim: true,
      maxlength: [100, "Treatment name cannot exceed 100 characters"],
    },
    beforeImage: {
      type: String,
      default: null,
    },
    afterImage: {
      type: String,
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    // Soft delete fields
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Audit fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true, // Creates createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries
customerStorySchema.index({ isPublished: 1, isDeleted: 1, createdAt: -1 });
customerStorySchema.index({ rating: 1 });
customerStorySchema.index({ treatment: 1 });

// Virtual for image URLs (if needed)
customerStorySchema.virtual("beforeImageUrl").get(function () {
  return this.beforeImage ? `/uploads/${this.beforeImage}` : null;
});

customerStorySchema.virtual("afterImageUrl").get(function () {
  return this.afterImage ? `/uploads/${this.afterImage}` : null;
});

// Pre-save middleware to ensure soft delete consistency
customerStorySchema.pre("save", function (next) {
  if (this.isDeleted && !this.deletedAt) {
    this.deletedAt = new Date();
  }
  next();
});

// Query middleware to exclude soft deleted documents by default
customerStorySchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

module.exports = mongoose.model("CustomerStory", customerStorySchema);
