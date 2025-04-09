import mongoose from "mongoose"

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Task title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["backlog", "todo", "in-progress", "review", "done", "archived"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Task must belong to a project"],
    },
    sprint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sprint",
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must have a reporter"],
    },
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dueDate: Date,
    estimatedHours: {
      type: Number,
      min: 0,
      default: 0,
    },
    actualHours: {
      type: Number,
      min: 0,
      default: 0,
    },
    tags: [String],
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    completedAt: Date,
    boardColumn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BoardColumn",
    },
    order: {
      type: Number,
      default: 0,
    },
    attachments: [
      {
        name: String,
        path: String,
        type: String,
        size: Number,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    checklist: [
      {
        title: String,
        completed: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual populate for comments
taskSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "task",
  localField: "_id",
})

// Virtual populate for subtasks
taskSchema.virtual("subtasks", {
  ref: "Task",
  foreignField: "parent",
  localField: "_id",
})

// Virtual populate for time entries
taskSchema.virtual("timeEntries", {
  ref: "TimeEntry",
  foreignField: "task",
  localField: "_id",
})

// Pre-save middleware to update completedAt date
taskSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "done" && !this.completedAt) {
    this.completedAt = Date.now()
  }
  next()
})

// Indexes for efficient queries
taskSchema.index({ title: "text", description: "text" })
taskSchema.index({ project: 1 })
taskSchema.index({ sprint: 1 })
taskSchema.index({ status: 1 })
taskSchema.index({ assignees: 1 })
taskSchema.index({ dueDate: 1 })
taskSchema.index({ reporter: 1 })
taskSchema.index({ boardColumn: 1, order: 1 })

const Task = mongoose.model("Task", taskSchema)

export default Task
