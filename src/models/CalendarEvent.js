import mongoose from "mongoose"

const calendarEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    location: String,
    color: String,
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Event must have a creator"],
    },
    attendees: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "declined", "tentative"],
          default: "pending",
        },
        responseTime: Date,
      },
    ],
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    type: {
      type: String,
      enum: ["meeting", "task", "reminder", "deadline", "holiday", "other"],
      default: "meeting",
    },
    recurrence: {
      enabled: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
      },
      interval: {
        type: Number,
        default: 1,
      },
      daysOfWeek: [Number], // 0 = Sunday, 1 = Monday, etc.
      endDate: Date,
      count: Number,
    },
    reminders: [
      {
        time: {
          value: Number,
          unit: {
            type: String,
            enum: ["minutes", "hours", "days"],
          },
        },
        type: {
          type: String,
          enum: ["email", "notification", "both"],
          default: "notification",
        },
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private", "team"],
      default: "public",
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
    notes: String,
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure startTime is before endTime
calendarEventSchema.path("endTime").validate(function (value) {
  if (this.startTime && value < this.startTime) {
    return false
  }
  return true
}, "End time must be after start time")

// Index for efficient queries
calendarEventSchema.index({ startTime: 1, endTime: 1 })
calendarEventSchema.index({ "attendees.user": 1 })
calendarEventSchema.index({ creator: 1 })

const CalendarEvent = mongoose.model("CalendarEvent", calendarEventSchema)

export default CalendarEvent
