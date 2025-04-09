import Joi from "joi"

export const createProjectSchema = Joi.object({
  name: Joi.string().required().max(100).trim().messages({
    "string.empty": "Project name is required",
    "string.max": "Project name cannot exceed 100 characters",
  }),
  description: Joi.string().trim(),
  status: Joi.string().valid("planning", "active", "on-hold", "completed", "cancelled").default("planning"),
  priority: Joi.string().valid("low", "medium", "high", "urgent").default("medium"),
  startDate: Joi.date().default(Date.now),
  endDate: Joi.date().greater(Joi.ref("startDate")).messages({
    "date.greater": "End date must be after start date",
  }),
  owner: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  members: Joi.array().items(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        "string.pattern.base": "Invalid member ID format",
      }),
  ),
  client: Joi.object({
    name: Joi.string().trim(),
    email: Joi.string().email().trim(),
    phone: Joi.string().trim(),
    company: Joi.string().trim(),
  }),
  budget: Joi.object({
    amount: Joi.number().min(0),
    currency: Joi.string().default("USD"),
  }),
  tags: Joi.array().items(Joi.string().trim()),
  progress: Joi.number().min(0).max(100).default(0),
})

export const updateProjectSchema = Joi.object({
  name: Joi.string().max(100).trim().messages({
    "string.max": "Project name cannot exceed 100 characters",
  }),
  description: Joi.string().trim(),
  status: Joi.string().valid("planning", "active", "on-hold", "completed", "cancelled"),
  priority: Joi.string().valid("low", "medium", "high", "urgent"),
  startDate: Joi.date(),
  endDate: Joi.date().greater(Joi.ref("startDate")).messages({
    "date.greater": "End date must be after start date",
  }),
  owner: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  client: Joi.object({
    name: Joi.string().trim(),
    email: Joi.string().email().trim(),
    phone: Joi.string().trim(),
    company: Joi.string().trim(),
  }),
  budget: Joi.object({
    amount: Joi.number().min(0),
    currency: Joi.string(),
  }),
  tags: Joi.array().items(Joi.string().trim()),
  progress: Joi.number().min(0).max(100),
  isArchived: Joi.boolean(),
})
