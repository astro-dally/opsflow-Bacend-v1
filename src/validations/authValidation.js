import Joi from "joi"

export const signupSchema = Joi.object({
  name: Joi.string().required().min(2).max(50).trim().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters",
  }),
  email: Joi.string().required().email().trim().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  passwordConfirm: Joi.string().required().valid(Joi.ref("password")).messages({
    "string.empty": "Password confirmation is required",
    "any.only": "Passwords do not match",
  }),
  role: Joi.string().valid("user", "team-lead", "manager", "admin"),
  department: Joi.string().trim(),
  position: Joi.string().trim(),
})

export const signinSchema = Joi.object({
  email: Joi.string().required().email().trim().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
})

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().required().email().trim().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
})

export const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  passwordConfirm: Joi.string().required().valid(Joi.ref("password")).messages({
    "string.empty": "Password confirmation is required",
    "any.only": "Passwords do not match",
  }),
})

export const updateMeSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters",
  }),
  email: Joi.string().email().trim().messages({
    "string.email": "Please provide a valid email address",
  }),
  department: Joi.string().trim(),
  position: Joi.string().trim(),
})

export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
  }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .messages({
      "string.empty": "New password is required",
      "string.min": "New password must be at least 8 characters long",
      "string.pattern.base":
        "New password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  passwordConfirm: Joi.string().required().valid(Joi.ref("password")).messages({
    "string.empty": "Password confirmation is required",
    "any.only": "Passwords do not match",
  }),
})

export const updateSettingsSchema = Joi.object({
  notifications: Joi.object({
    email: Joi.boolean(),
    taskAssigned: Joi.boolean(),
    projectUpdates: Joi.boolean(),
    teamChanges: Joi.boolean(),
    dueDateReminders: Joi.boolean(),
  }),
  appearance: Joi.object({
    theme: Joi.string().valid("light", "dark", "system"),
    compactMode: Joi.boolean(),
  }),
  security: Joi.object({
    twoFactorAuth: Joi.boolean(),
  }),
})
