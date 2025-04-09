import AppError from "../utils/appError.js"

/**
 * Validate request data against a Joi schema
 * @param {Object} schema - Joi schema
 * @returns {Function} Express middleware
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    if (!schema) return next()

    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false,
    })

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ")
      return next(new AppError(errorMessage, 400))
    }

    next()
  }
}
