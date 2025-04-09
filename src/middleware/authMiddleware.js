/**
 * Authentication Middleware
 *
 * This module provides middleware functions for protecting routes and handling user authentication.
 */
import jwt from "jsonwebtoken"
import { promisify } from "util"
import AppError from "../utils/appError.js"
import catchAsync from "../utils/catchAsync.js"
import User from "../models/User.js"
import config from "../config/config.js"

/**
 * Protect routes - verify user is authenticated
 */
export const protect = catchAsync(async (req, res, next) => {
  // 1) Get token from authorization header
  let token
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return next(new AppError("You are not logged in. Please log in to get access.", 401))
  }

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, config.jwt.secret)

  // 3) Check if user still exists
  const user = await User.findById(decoded.id)
  if (!user) {
    return next(new AppError("The user belonging to this token no longer exists.", 401))
  }

  // 4) Check if user changed password after the token was issued
  if (user.hasPasswordChangedAfter(decoded.iat)) {
    return next(new AppError("User recently changed password. Please log in again.", 401))
  }

  // Grant access to protected route
  req.user = user
  next()
})

/**
 * Restrict access to certain roles
 * @param  {...string} roles - Allowed roles
 * @returns {Function} Middleware function
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403))
    }
    next()
  }
}

/**
 * Handle refresh token functionality
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
  const accessToken = jwt.sign({ id: user._id }, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn,
  })

  res.status(200).json({
    status: "success",
    data: {
      accessToken,
    },
  })
})
