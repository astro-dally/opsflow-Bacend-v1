import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Comment must belong to a user"],
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    attachments: [
      {
        filename: String,
        path: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    edited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for replies
commentSchema.virtual("replies", {
  ref: "Comment",
  foreignField: "parent",
  localField: "_id",
})

// Ensure at least one of task or project is provided
commentSchema.pre("save", function (next) {
  if (!this.task && !this.project) {
    next(new Error("Comment must be associated with either a task or a project"))
  } else {
    next()
  }
})

// Index for efficient querying
commentSchema.index({ task: 1, createdAt: -1 })
commentSchema.index({ project: 1, createdAt: -1 })

const Comment = mongoose.model("Comment", commentSchema)

export default Comment
