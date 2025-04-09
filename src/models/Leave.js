import mongoose from "mongoose"

const leaveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Leave must belong to a user"],
    },
    leaveType: {
      type: String,
      enum: ["sick", "vacation", "personal", "bereavement", "unpaid", "other"],
      required: [true, "Leave type is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    totalDays: {
      type: Number,
      default: 1,
    },
    reason: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "File",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Pre-save middleware to calculate total days
leaveSchema.pre("save", function (next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    this.totalDays = diffDays + 1 // Include both start and end days
  }
  next()
})

// Ensure startDate is before endDate
leaveSchema.path("endDate").validate(function (value) {
  if (this.startDate && value < this.startDate) {
    return false
  }
  return true
}, "End date must be after start date")

// Index for efficient queries
leaveSchema.index({ user: 1, status: 1 })
leaveSchema.index({ approvedBy: 1 })

const Leave = mongoose.model("Leave", leaveSchema)

export default Leave
