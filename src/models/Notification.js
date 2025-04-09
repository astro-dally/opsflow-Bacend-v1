import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Notification must have a recipient"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "task-assigned",
        "task-completed",
        "comment-added",
        "due-date-approaching",
        "project-update",
        "mention",
        "team-invite",
        "report-ready",
        "leave-request",
        "leave-approved",
        "leave-rejected",
        "system",
      ],
      required: [true, "Notification type is required"],
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
    },
    description: String,
    read: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    actionLink: String,
    relatedModel: {
      type: String,
      enum: ["Task", "Project", "Comment", "User", "Team", "Report", "Leave"],
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    metadata: {
      type: Object,
    },
    expiresAt: Date,
  },
  {
    timestamps: true,
  },
)

// Create compound index for efficient queries
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 })

// Mark notification as read
notificationSchema.methods.markAsRead = function () {
  this.read = true
  this.readAt = new Date()
  return this.save()
}

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification
