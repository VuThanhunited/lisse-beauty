const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerInfo: {
      name: {
        type: String,
        required: [true, "Tên khách hàng là bắt buộc"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email là bắt buộc"],
        lowercase: true,
      },
      phone: {
        type: String,
        required: [true, "Số điện thoại là bắt buộc"],
      },
      age: Number,
      gender: {
        type: String,
        enum: ["male", "female", "other"],
      },
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Dịch vụ là bắt buộc"],
    },
    appointmentDate: {
      type: Date,
      required: [true, "Ngày hẹn là bắt buộc"],
    },
    appointmentTime: {
      type: String,
      required: [true, "Giờ hẹn là bắt buộc"],
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "in-progress",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "pending",
    },
    price: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "transfer", "card", "online"],
      default: "cash",
    },
    deposit: {
      amount: { type: Number, default: 0 },
      paidAt: Date,
      method: String,
    },
    notes: {
      customer: String, // Customer notes
      staff: String, // Staff notes
      admin: String, // Admin notes
    },
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isFirstTime: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      enum: ["website", "phone", "walk-in", "referral", "social-media"],
      default: "website",
    },
    reminderSent: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
    },
    followUpSent: {
      type: Boolean,
      default: false,
    },
    cancellation: {
      reason: String,
      cancelledBy: String, // 'customer' or 'admin'
      cancelledAt: Date,
      refundAmount: Number,
    },
    completedAt: Date,
    feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feedback",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ serviceId: 1 });
bookingSchema.index({ appointmentDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ "customerInfo.email": 1 });
bookingSchema.index({ "customerInfo.phone": 1 });
bookingSchema.index({ assignedStaff: 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for full appointment datetime
bookingSchema.virtual("fullAppointmentTime").get(function () {
  const date = new Date(this.appointmentDate);
  return `${date.toLocaleDateString("vi-VN")} ${this.appointmentTime}`;
});

// Virtual for total amount
bookingSchema.virtual("totalAmount").get(function () {
  return this.price;
});

// Virtual for remaining amount
bookingSchema.virtual("remainingAmount").get(function () {
  return this.price - (this.deposit.amount || 0);
});

// Pre-save middleware to generate booking ID
bookingSchema.pre("save", async function (next) {
  if (!this.bookingId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    // Find the last booking of today
    const todayStart = new Date(date.setHours(0, 0, 0, 0));
    const todayEnd = new Date(date.setHours(23, 59, 59, 999));

    const lastBooking = await this.constructor
      .findOne({
        createdAt: { $gte: todayStart, $lte: todayEnd },
      })
      .sort({ createdAt: -1 });

    let sequence = 1;
    if (lastBooking && lastBooking.bookingId) {
      const lastSequence = parseInt(lastBooking.bookingId.slice(-3));
      sequence = lastSequence + 1;
    }

    this.bookingId = `LB${year}${month}${day}${sequence
      .toString()
      .padStart(3, "0")}`;
  }
  next();
});

// Static method to find upcoming appointments
bookingSchema.statics.findUpcoming = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return this.find({
    appointmentDate: { $gte: today },
    status: { $in: ["pending", "confirmed"] },
  }).sort({ appointmentDate: 1, appointmentTime: 1 });
};

// Static method to find today's appointments
bookingSchema.statics.findToday = function () {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  return this.find({
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
  }).sort({ appointmentTime: 1 });
};

// Instance method to send reminder
bookingSchema.methods.sendReminder = async function () {
  // Implementation for sending reminder emails/SMS
  console.log(`Sending reminder for booking ${this.bookingId}`);
  return true;
};

module.exports = mongoose.model("Booking", bookingSchema);
