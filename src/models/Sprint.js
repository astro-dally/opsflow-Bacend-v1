import mongoose from "mongoose"

const sprintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sprint name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Sprint must belong to a project"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    status: {
      type: String,
      enum: ["planning", "active", "completed", "cancelled"],
      default: "planning",
    },
    goal: {
      type: String,
    },
    retrospective: {
      whatWentWell: [String],
      whatWentWrong: [String],
      improvements: [String],
      additionalNotes: String,
      completedAt: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual populate for sprint tasks
sprintSchema.virtual("tasks", {
  ref: "Task",
  foreignField: "sprint",
  localField: "_id",
})

// Ensure startDate is before endDate
sprintSchema.path("endDate").validate(function (value) {
  if (this.startDate && value < this.startDate) {
    return false
  }
  return true
}, "End date must be after start date")

// Index for efficient queries
sprintSchema.index({ project: 1, status: 1, startDate: -1 })

const Sprint = mongoose.model("Sprint", sprintSchema)

export default Sprint
