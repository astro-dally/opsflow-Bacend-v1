import AppError from "../utils/appError.js"
import logger from "../utils/logger.js"

/**
 * Handle cast error from MongoDB
 * @param {Object} err - Error object
 * @returns {AppError} Formatted error
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

/**
 * Handle duplicate field error from MongoDB
 * @param {Object} err - Error object
 * @returns {AppError} Formatted error
 */
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0]
  const value = err.keyValue[field]
  const message = `Duplicate field value: ${field} = ${value}. Please use another value.`
  return new AppError(message, 400)
}

/**
 * Handle validation error from MongoDB
 * @param {Object} err - Error object
 * @returns {AppError} Formatted error
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message)
  const message = `Invalid input data: ${errors.join(". ")}`
  return new AppError(message, 400)
}

/**
 * Handle JWT error
 * @returns {AppError} Formatted error
 */
const handleJWTError = () => new AppError("Invalid token. Please log in again.", 401)

/**
 * Handle JWT expired error
 * @returns {AppError} Formatted error
 */
const handleJWTExpiredError = () => new AppError("Your token has expired. Please log in again.", 401)

/**
 * Send detailed error in development
 * @param {Object} err - Error object
 * @param {Object} res - Response object
 */
const sendErrorDev = (err, req, res) => {
  logger.error(`ERROR: ${err.stack}`)

  // API error response
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    requestId: req.id,
    path: req.originalUrl,
  })
}

/**
 * Send error in production with limited info
 * @param {Object} err - Error object
 * @param {Object} res - Response object
 */
const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      requestId: req.id,
    })
  }
  // Programming or other unknown error: don't leak details
  else {
    // Log error
    logger.error("ERROR 💥", {
      error: err.message,
      stack: err.stack,
      requestId: req.id,
      path: req.originalUrl,
    })

    // Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      requestId: req.id,
    })
  }
}

/**
 * Not found middleware
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
export const notFound = (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
}

/**
 * Global error handler middleware
 * @param {Object} err - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Add request ID for tracking
  req.id = req.id || `req-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`

  err.statusCode = err.statusCode || 500
  err.status = err.status || "error"

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res)
  } else if (process.env.NODE_ENV === "production") {
    // Create a deep copy of the error to avoid mutation
    let error = JSON.parse(JSON.stringify(err))
    error.message = err.message
    error.stack = err.stack

    // Handle specific error types
    if (error.name === "CastError") error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldsDB(error)
    if (error.name === "ValidationError") error = handleValidationErrorDB(error)
    if (error.name === "JsonWebTokenError") error = handleJWTError()
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError()

    sendErrorProd(error, req, res)
  }
}
