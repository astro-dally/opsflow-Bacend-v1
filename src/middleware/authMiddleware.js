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
import { isBlacklisted } from "../services/tokenService.js"
import { getPermissions } from "../services/permissionService.js"

/**
 * Protect routes - verify user is authenticated
 */
export const protect = catchAsync(async (req, res, next) => {
  // 1) Get token from authorization header or cookie
  let token
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken
  }

  // In development mode, allow bypassing authentication with a special header
  if (process.env.NODE_ENV === "development" && req.headers["x-bypass-auth"] === "true") {
    // Create a mock user for development
    req.user = {
      id: "dev-user-id",
      name: "Development User",
      email: "dev@example.com",
      role: "admin",
      _id: "dev-user-id",
    }
    return next()
  }

  if (!token) {
    return next(new AppError("You are not logged in. Please log in to get access.", 401))
  }

  // 2) Check if token is blacklisted
  const isTokenBlacklisted = await isBlacklisted(token)
  if (isTokenBlacklisted) {
    return next(new AppError("Invalid token. Please log in again.", 401))
  }

  try {
    // 3) Verify token
    const decoded = await promisify(jwt.verify)(token, config.jwt.secret)

    // 4) Check if user still exists
    const user = await User.findById(decoded.id)
    if (!user) {
      return next(new AppError("The user belonging to this token no longer exists.", 401))
    }

    // 5) Check if user changed password after the token was issued
    if (user.hasPasswordChangedAfter && user.hasPasswordChangedAfter(decoded.iat)) {
      return next(new AppError("User recently changed password. Please log in again.", 401))
    }

    // Grant access to protected route
    req.user = user
    next()
  } catch (error) {
    return next(new AppError(`Authentication error: ${error.message}`, 401))
  }
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
 * Check if user has permission for a specific resource and action
 * @param {string} resource - Resource name (e.g., 'project', 'task')
 * @param {string} action - Action name (e.g., 'read', 'create', 'update', 'delete')
 * @returns {Function} Middleware function
 */
export const hasPermission = (resource, action) => {
  return catchAsync(async (req, res, next) => {
    // Get user permissions
    const permissions = await getPermissions(req.user)

    // Check if user has permission
    if (!permissions.can(resource, action, req)) {
      return next(new AppError("You do not have permission to perform this action", 403))
    }

    next()
  })
}
