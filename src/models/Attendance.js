import mongoose from "mongoose"

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Attendance must belong to a user"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    clockInTime: {
      type: Date,
      required: function () {
        return this.status !== "absent" // Only required if status is not "absent"
      },
    },
    clockOutTime: {
      type: Date,
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "half-day", "leave"],
      default: "present",
    },
    notes: {
      type: String,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
      address: String,
    },
    ipAddress: String,
    device: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Pre-save middleware to calculate total hours
attendanceSchema.pre("save", function (next) {
  if (this.clockInTime && this.clockOutTime) {
    this.totalHours = (this.clockOutTime - this.clockInTime) / (1000 * 60 * 60)
  }
  next()
})

// Pre-find middleware to populate user
attendanceSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email avatar",
  })
  next()
})

// Index for faster queries
attendanceSchema.index({ user: 1, date: -1 })
attendanceSchema.index({ status: 1 })

const Attendance = mongoose.model("Attendance", attendanceSchema)

export default Attendance
