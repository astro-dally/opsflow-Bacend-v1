/**
 * Authentication Controller
 *
 * This module handles user authentication and authorization, including signup, signin, logout,
 * forgot password, reset password, and email verification.
 */
import jwt from "jsonwebtoken"
import crypto from "crypto"
import User from "../../models/User.js"
import catchAsync from "../../utils/catchAsync.js"
import AppError from "../../utils/appError.js"
import Email from "../../utils/email.js"
import config from "../../config/config.js"
import { addToBlacklist } from "../../services/tokenService.js"
import { promisify } from "util"

/**
 * Generate JWT token with enhanced security
 * @param {string} id - User ID
 * @param {string} expiresIn - Token expiry time
 * @returns {string} JWT token
 */
const signToken = (id, expiresIn) => {
  return jwt.sign(
    {
      id,
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomBytes(16).toString("hex"),
    },
    config.jwt.secret,
    { expiresIn },
  )
}

/**
 * Create and send tokens in response
 * @param {Object} user - User document
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const createSendTokens = (user, statusCode, res) => {
  // Create access token
  const accessToken = signToken(user._id, config.jwt.accessExpiresIn)

  // Create refresh token with unique identifier
  const refreshToken = signToken(user._id, config.jwt.refreshExpiresIn)

  // Remove sensitive data
  user.password = undefined

  // Set secure HTTP-only cookie with the access token
  if (process.env.NODE_ENV === "production") {
    res.cookie("accessToken", accessToken, {
      expires: new Date(Date.now() + Number.parseInt(config.jwt.accessExpiresIn) * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
  }

  res.status(statusCode).json({
    status: "success",
    data: {
      user,
      accessToken,
      refreshToken,
    },
  })
}

/**
 * User signup
 */
export const signup = catchAsync(async (req, res, next) => {
  // Create new user
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role || "user",
  })

  // Generate email verification token
  const verificationToken = newUser.createEmailVerificationToken()
  await newUser.save({ validateBeforeSave: false })

  // Create verification URL - use frontend URL from config
  const verifyUrl = `${config.frontendUrl}/verify-email?token=${verificationToken}`

  try {
    // Send verification email
    await new Email(newUser, verifyUrl).sendWelcome()

    createSendTokens(newUser, 201, res)
  } catch (err) {
    // Roll back if email fails
    newUser.emailVerificationToken = undefined
    newUser.emailVerificationExpires = undefined
    await newUser.save({ validateBeforeSave: false })

    return next(new AppError("There was an error sending the email. Try again later!", 500))
  }
})

/**
 * User login with account lockout protection
 */
export const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400))
  }

  // Check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password +loginAttempts +lockUntil")

  // Check if account is locked
  if (user && user.isLocked()) {
    const waitTime = Math.ceil((user.lockUntil - Date.now()) / 60000)
    return next(new AppError(`Account is locked. Please try again after ${waitTime} minutes`, 401))
  }

  // Check password and handle failed attempts
  if (!user || !(await user.correctPassword(password, user.password))) {
    if (user) {
      // Increment login attempts
      user.loginAttempts += 1

      // Lock account if too many attempts
      if (user.loginAttempts >= config.security.maxLoginAttempts) {
        user.lockUntil = Date.now() + config.security.lockTime
      }

      await user.save({ validateBeforeSave: false })
    }

    return next(new AppError("Incorrect email or password", 401))
  }

  // Reset login attempts on successful login
  user.loginAttempts = 0
  user.lockUntil = undefined
  await user.save({ validateBeforeSave: false })

  // Send tokens
  createSendTokens(user, 200, res)
})

/**
 * User logout - invalidate token
 */
export const logout = catchAsync(async (req, res, next) => {
  // Get token from authorization header
  let token
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]

    // Add token to blacklist
    if (token) {
      await addToBlacklist(token)
    }
  }

  // Clear cookie if it exists
  res.clearCookie("accessToken")

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  })
})

/**
 * Forgot password
 */
export const forgotPassword = catchAsync(async (req, res, next) => {
  // Get user by email
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new AppError("There is no user with this email address", 404))
  }

  // Generate reset token
  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  // Create reset URL - use frontend URL from config
  const resetURL = `${config.frontendUrl}/reset-password?token=${resetToken}`

  try {
    // Send reset email
    await new Email(user, resetURL).sendPasswordReset()

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    })
  } catch (err) {
    // Roll back if email fails
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(new AppError("There was an error sending the email. Try again later!", 500))
  }
})

/**
 * Reset password - using token in request body instead of URL params
 */
export const resetPassword = catchAsync(async (req, res, next) => {
  // Get token from request body and hash it
  const { token, password, passwordConfirm } = req.body

  if (!token) {
    return next(new AppError("Reset token is required", 400))
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

  // Find user by token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400))
  }

  // Update password
  user.password = password
  user.passwordConfirm = passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  // Send password changed email
  try {
    await new Email(user, "").sendPasswordChanged()
  } catch (err) {
    // Just log error, don't block process
    console.error("Error sending password changed email", err)
  }

  // Send tokens
  createSendTokens(user, 200, res)
})

/**
 * Verify email
 */
export const verifyEmail = catchAsync(async (req, res, next) => {
  // Get token from request body and hash it
  const { token } = req.body

  if (!token) {
    return next(new AppError("Verification token is required", 400))
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

  // Find user by token
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  })

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400))
  }

  // Update user
  user.isEmailVerified = true
  user.emailVerificationToken = undefined
  user.emailVerificationExpires = undefined
  await user.save({ validateBeforeSave: false })

  // Send tokens
  createSendTokens(user, 200, res)
})

/**
 * Get current user
 */
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  })
})

/**
 * Update current user
 */
export const updateMe = catchAsync(async (req, res, next) => {
  // Prevent password update
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates. Please use /update-password", 400))
  }

  // Filter allowed fields
  const filteredBody = filterObj(req.body, "name", "email", "department", "position")

  // Update user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  })
})

/**
 * Update password
 */
export const updatePassword = catchAsync(async (req, res, next) => {
  // Get user
  const user = await User.findById(req.user.id).select("+password")

  // Check current password
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Current password is incorrect", 401))
  }

  // Update password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()

  // Send tokens
  createSendTokens(user, 200, res)
})

/**
 * Get user settings
 */
export const getSettings = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("settings")

  res.status(200).json({
    status: "success",
    data: {
      settings: user.settings,
    },
  })
})

/**
 * Update user settings
 */
export const updateSettings = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { settings: req.body },
    {
      new: true,
      runValidators: true,
    },
  ).select("settings")

  res.status(200).json({
    status: "success",
    data: {
      settings: updatedUser.settings,
    },
  })
})

/**
 * Refresh token
 */
export const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return next(new AppError("Please provide refresh token", 400))
  }

  // Verify refresh token
  const decoded = await promisify(jwt.verify)(refreshToken, config.jwt.secret)

  // Check if user exists
  const user = await User.findById(decoded.id)
  if (!user) {
    return next(new AppError("Invalid refresh token", 401))
  }

  // Check if user changed password after token issued
  if (user.hasPasswordChangedAfter(decoded.iat)) {
    return next(new AppError("User recently changed password. Please log in again.", 401))
  }

  // Generate new access token
  const accessToken = signToken(user._id, config.jwt.accessExpiresIn)

  res.status(200).json({
    status: "success",
    data: {
      accessToken,
    },
  })
})

/**
 * Filter object - only keep allowed fields
 * @param {Object} obj - Object to filter
 * @param  {...string} allowedFields - Fields to keep
 * @returns {Object} Filtered object
 */
const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}
