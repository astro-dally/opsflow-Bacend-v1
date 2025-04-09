import Joi from "joi"

export const createTaskSchema = Joi.object({
  title: Joi.string().required().max(200).trim().messages({
    "string.empty": "Task title is required",
    "string.max": "Task title cannot exceed 200 characters",
  }),
  description: Joi.string().trim(),
  status: Joi.string().valid("backlog", "todo", "in-progress", "review", "done", "archived").default("todo"),
  priority: Joi.string().valid("low", "medium", "high", "urgent").default("medium"),
  project: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.empty": "Project ID is required",
      "string.pattern.base": "Invalid project ID format",
    }),
  sprint: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid sprint ID format",
    }),
  reporter: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid reporter ID format",
    }),
  assignees: Joi.array().items(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        "string.pattern.base": "Invalid assignee ID format",
      }),
  ),
  dueDate: Joi.date(),
  estimatedHours: Joi.number().min(0),
  tags: Joi.array().items(Joi.string().trim()),
  parent: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid parent task ID format",
    }),
  boardColumn: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid board column ID format",
    }),
  order: Joi.number(),
  checklist: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      completed: Joi.boolean().default(false),
    }),
  ),
})

export const updateTaskSchema = Joi.object({
  title: Joi.string().max(200).trim().messages({
    "string.max": "Task title cannot exceed 200 characters",
  }),
  description: Joi.string().trim(),
  status: Joi.string().valid("backlog", "todo", "in-progress", "review", "done", "archived"),
  priority: Joi.string().valid("low", "medium", "high", "urgent"),
  project: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid project ID format",
    }),
  sprint: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid sprint ID format",
    }),
  reporter: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid reporter ID format",
    }),
  assignees: Joi.array().items(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        "string.pattern.base": "Invalid assignee ID format",
      }),
  ),
  dueDate: Joi.date(),
  estimatedHours: Joi.number().min(0),
  actualHours: Joi.number().min(0),
  tags: Joi.array().items(Joi.string().trim()),
  parent: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid parent task ID format",
    }),
  boardColumn: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid board column ID format",
    }),
  order: Joi.number(),
  checklist: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      completed: Joi.boolean(),
      createdAt: Joi.date(),
    }),
  ),
})

export const taskCommentSchema = Joi.object({
  content: Joi.string().required().trim().messages({
    "string.empty": "Comment content is required",
  }),
  attachments: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      path: Joi.string().required(),
      type: Joi.string(),
      size: Joi.number(),
    }),
  ),
  mentions: Joi.array().items(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        "string.pattern.base": "Invalid user ID format for mention",
      }),
  ),
})

export const updateTaskStatusSchema = Joi.object({
  status: Joi.string().required().valid("backlog", "todo", "in-progress", "review", "done", "archived").messages({
    "string.empty": "Status is required",
    "any.only": "Status must be one of: backlog, todo, in-progress, review, done, archived",
  }),
})
