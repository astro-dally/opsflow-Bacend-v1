import mongoose from "mongoose"

const reportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Report name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "time-tracking",
        "project-performance",
        "team-performance",
        "resource-allocation",
        "attendance",
        "task-completion",
        "custom",
      ],
      required: [true, "Report type is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Report must have an owner"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastRunAt: Date,
    configuration: {
      dateRange: {
        start: Date,
        end: Date,
        type: {
          type: String,
          enum: [
            "custom",
            "last7days",
            "last30days",
            "thisMonth",
            "lastMonth",
            "thisQuarter",
            "lastQuarter",
            "thisYear",
            "lastYear",
          ],
          default: "thisMonth",
        },
      },
      filters: Object, // Flexible object to store different filters based on report type
      groupBy: [String],
      sortBy: {
        field: String,
        direction: {
          type: String,
          enum: ["asc", "desc"],
          default: "desc",
        },
      },
      limit: {
        type: Number,
        default: 100,
      },
    },
    visualization: {
      type: {
        type: String,
        enum: ["table", "bar", "line", "pie", "area", "scatter", "heatmap", "none"],
        default: "table",
      },
      options: Object, // Flexible object to store visualization options
    },
    scheduling: {
      isScheduled: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: ["daily", "weekly", "biweekly", "monthly", "quarterly"],
      },
      dayOfWeek: {
        type: Number, // 0 = Sunday, 1 = Monday, etc.
      },
      dayOfMonth: {
        type: Number,
      },
      time: String, // HH:mm format
      recipients: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          email: String,
        },
      ],
      lastSent: Date,
      nextScheduled: Date,
      format: {
        type: String,
        enum: ["pdf", "csv", "excel", "html"],
        default: "pdf",
      },
    },
    sharedWith: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        permission: {
          type: String,
          enum: ["view", "edit"],
          default: "view",
        },
      },
    ],
    lastResults: {
      summary: Object,
      generatedAt: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
reportSchema.index({ owner: 1, type: 1 })
reportSchema.index({ "sharedWith.user": 1 })
reportSchema.index({ "scheduling.isScheduled": 1, "scheduling.nextScheduled": 1 })

const Report = mongoose.model("Report", reportSchema)

export default Report
