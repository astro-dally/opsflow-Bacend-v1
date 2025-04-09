import mongoose from "mongoose"

const columnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Column name is required"],
    trim: true,
  },
  description: String,
  order: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    default: 0, // 0 means no limit
  },
  color: String,
  taskStatus: {
    type: String,
    enum: ["todo", "in-progress", "review", "done", "archived"],
  },
})

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Board name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Board must belong to a project"],
    },
    type: {
      type: String,
      enum: ["kanban", "scrum", "custom"],
      default: "kanban",
    },
    columns: [columnSchema],
    isDefault: {
      type: Boolean,
      default: false,
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

// Virtual populate for board tasks
boardSchema.virtual("tasks", {
  ref: "Task",
  foreignField: "board",
  localField: "_id",
})

// Ensure default board is unique per project
boardSchema.pre("save", async function (next) {
  if (this.isDefault) {
    const otherDefaultBoard = await this.constructor.findOne({
      project: this.project,
      isDefault: true,
      _id: { $ne: this._id },
    })

    if (otherDefaultBoard) {
      otherDefaultBoard.isDefault = false
      await otherDefaultBoard.save()
    }
  }
  next()
})

// Index for efficient queries
boardSchema.index({ project: 1 })

const Board = mongoose.model("Board", boardSchema)

export default Board
