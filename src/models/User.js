/**
 * User Model
 *
 * This module defines the schema for the User model and includes methods for password hashing,
 * token generation, and password comparison.
 */
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Please provide a valid email address"],
    },
    avatar: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // This validator only works on CREATE and SAVE
        validator: function (el) {
          return el === this.password
        },
        message: "Passwords do not match",
      },
    },
    role: {
      type: String,
      enum: ["user", "team-lead", "manager", "admin"],
      default: "user",
    },
    department: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    settings: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        taskAssigned: {
          type: Boolean,
          default: true,
        },
        projectUpdates: {
          type: Boolean,
          default: true,
        },
        teamChanges: {
          type: Boolean,
          default: true,
        },
        dueDateReminders: {
          type: Boolean,
          default: true,
        },
      },
      appearance: {
        theme: {
          type: String,
          enum: ["light", "dark", "system"],
          default: "system",
        },
        compactMode: {
          type: Boolean,
          default: false,
        },
      },
      security: {
        twoFactorAuth: {
          type: Boolean,
          default: false,
        },
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual populate fields
userSchema.virtual("projects", {
  ref: "Project",
  foreignField: "members",
  localField: "_id",
})

userSchema.virtual("assignedTasks", {
  ref: "Task",
  foreignField: "assignees",
  localField: "_id",
})

userSchema.virtual("teams", {
  ref: "Team",
  foreignField: "members.user",
  localField: "_id",
})

// Pre-save middleware: Hash password
userSchema.pre("save", async function (next) {
  // Only run if password was modified
  if (!this.isModified("password")) return next()

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)

  // Delete passwordConfirm field
  this.passwordConfirm = undefined

  // Set passwordChangedAt if not a new user
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000
  }

  next()
})

// Pre-find middleware: Filter out inactive users
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } })
  next()
})

/**
 * Compare passwords method
 */
// Compare passwords method
userSchema.methods.correctPassword = async (candidatePassword, userPassword) =>
  await bcrypt.compare(candidatePassword, userPassword)

/**
 * Check if password was changed after token was issued
 */
// Check if password was changed after token was issued
userSchema.methods.hasPasswordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Number.parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return JWTTimestamp < changedTimestamp
  }
  return false
}

/**
 * Create password reset token
 */
// Create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex")

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  this.passwordResetExpires = Date.now() + 60 * 60 * 1000 // 1 hour

  return resetToken
}

/**
 * Create email verification token
 */
// Create email verification token
userSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex")

  this.emailVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex")

  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

  return verificationToken
}

const User = mongoose.model("User", userSchema)

export default User
