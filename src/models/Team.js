import mongoose from "mongoose"

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Team must have a leader"],
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["member", "manager", "lead", "admin"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    department: {
      type: String,
    },
    avatar: String,
    isActive: {
      type: Boolean,
      default: true,
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

// Virtual populate for team projects
teamSchema.virtual("projects", {
  ref: "Project",
  foreignField: "team",
  localField: "_id",
})

// Method to check if user is a member of the team
teamSchema.methods.hasMember = function (userId) {
  return this.members.some((member) => member.user.toString() === userId.toString())
}

// Method to get member's role in the team
teamSchema.methods.getMemberRole = function (userId) {
  const member = this.members.find((member) => member.user.toString() === userId.toString())
  return member ? member.role : null
}

// Index for efficient queries
teamSchema.index({ name: "text", description: "text" })

const Team = mongoose.model("Team", teamSchema)

export default Team
