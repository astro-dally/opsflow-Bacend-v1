import mongoose from "mongoose"

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - name
 *         - owner
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated project ID
 *         name:
 *           type: string
 *           description: Project name
 *         description:
 *           type: string
 *           description: Project description
 *         status:
 *           type: string
 *           enum: [planning, active, on-hold, completed, cancelled]
 *           description: Project status
 *         priority:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *           description: Project priority
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Project start date
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Project end date
 *         owner:
 *           type: string
 *           description: User ID of project owner
 *         members:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs
 *         client:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *             company:
 *               type: string
 *         budget:
 *           type: object
 *           properties:
 *             amount:
 *               type: number
 *             currency:
 *               type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         progress:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         isArchived:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProjectInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [planning, active, on-hold, completed, cancelled]
 *         priority:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         owner:
 *           type: string
 *         members:
 *           type: array
 *           items:
 *             type: string
 *         client:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *             company:
 *               type: string
 *         budget:
 *           type: object
 *           properties:
 *             amount:
 *               type: number
 *             currency:
 *               type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         progress:
 *           type: number
 *     ProjectUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [planning, active, on-hold, completed, cancelled]
 *         priority:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         owner:
 *           type: string
 *         client:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *             company:
 *               type: string
 *         budget:
 *           type: object
 *           properties:
 *             amount:
 *               type: number
 *             currency:
 *               type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         progress:
 *           type: number
 *         isArchived:
 *           type: boolean
 */

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["planning", "active", "on-hold", "completed", "cancelled"],
      default: "planning",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project must have an owner"],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    client: {
      name: String,
      email: String,
      phone: String,
      company: String,
    },
    budget: {
      amount: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    tags: [String],
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual populate for tasks
projectSchema.virtual("tasks", {
  ref: "Task",
  foreignField: "project",
  localField: "_id",
})

// Virtual populate for time entries
projectSchema.virtual("timeEntries", {
  ref: "TimeEntry",
  foreignField: "project",
  localField: "_id",
})

// Indexes for efficient queries
projectSchema.index({ name: "text", description: "text" })
projectSchema.index({ status: 1 })
projectSchema.index({ owner: 1 })
projectSchema.index({ members: 1 })
projectSchema.index({ tags: 1 })

const Project = mongoose.model("Project", projectSchema)

export default Project
