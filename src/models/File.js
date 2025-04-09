import mongoose from "mongoose"

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, "Filename is required"],
    },
    originalName: {
      type: String,
      required: [true, "Original filename is required"],
    },
    path: {
      type: String,
      required: [true, "File path is required"],
    },
    size: {
      type: Number,
      required: [true, "File size is required"],
    },
    mimetype: {
      type: String,
      required: [true, "File mimetype is required"],
    },
    extension: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "File must have an uploader"],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    tags: [String],
    isPublic: {
      type: Boolean,
      default: false,
    },
    accessibleBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    description: String,
    thumbnail: String,
  },
  {
    timestamps: true,
  },
)

// Ensure at least one relation field is provided
fileSchema.pre("save", function (next) {
  if (!this.project && !this.task && !this.comment) {
    next(new Error("File must be associated with at least one entity: project, task, or comment"))
  } else {
    next()
  }
})

// Index for efficient queries
fileSchema.index({ project: 1, mimetype: 1 })
fileSchema.index({ task: 1, mimetype: 1 })
fileSchema.index({ uploadedBy: 1, createdAt: -1 })

const File = mongoose.model("File", fileSchema)

export default File
