import mongoose from "mongoose"

const timeEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Time entry must belong to a user"],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Time entry must belong to a project"],
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    description: {
      type: String,
      trim: true,
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: Date,
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    isBillable: {
      type: Boolean,
      default: true,
    },
    billableRate: {
      type: Number,
      default: 0,
    },
    isRunning: {
      type: Boolean,
      default: false,
    },
    isManual: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    source: {
      type: String,
      enum: ["manual", "timer", "calendar", "pomodoro"],
      default: "manual",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Pre-save middleware to calculate duration
timeEntrySchema.pre("save", function (next) {
  if (this.startTime && this.endTime) {
    const diffInMs = this.endTime - this.startTime
    this.duration = Math.round(diffInMs / 60000) // Convert to minutes
    this.isRunning = false
  }
  next()
})

// Validation: end time must be after start time
timeEntrySchema.path("endTime").validate(function (value) {
  if (!value) return true // No end time means timer is running
  return value > this.startTime
}, "End time must be after start time")

// Virtual for billable amount
timeEntrySchema.virtual("billableAmount").get(function () {
  if (!this.isBillable || !this.billableRate || !this.duration) return 0
  return (this.billableRate * this.duration) / 60 // Convert minutes to hours
})

// Indexes for efficient queries
timeEntrySchema.index({ user: 1, startTime: -1 })
timeEntrySchema.index({ project: 1 })
timeEntrySchema.index({ task: 1 })
timeEntrySchema.index({ isBillable: 1 })
timeEntrySchema.index({ isRunning: 1 })

const TimeEntry = mongoose.model("TimeEntry", timeEntrySchema)

export default TimeEntry
