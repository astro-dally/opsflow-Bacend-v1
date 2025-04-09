import express from "express"
import {
  signup,
  signin,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getMe,
  updateMe,
  updatePassword,
  getSettings,
  updateSettings,
  refreshToken,
} from "../../controllers/auth/authController.js"
import { protect } from "../../middleware/authMiddleware.js"
import { validateRequest } from "../../middleware/validateMiddleware.js"
import {
  signupSchema,
  signinSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateMeSchema,
  updatePasswordSchema,
  updateSettingsSchema,
} from "../../validations/authValidation.js"

const router = express.Router()

// Public routes
router.post("/signup", validateRequest(signupSchema), signup)
router.post("/signin", validateRequest(signinSchema), signin)
router.post("/logout", logout)
router.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPassword)
router.patch("/reset-password/:token", validateRequest(resetPasswordSchema), resetPassword)
router.patch("/verify-email/:token", verifyEmail)
router.post("/refresh-token", refreshToken)

// Protected routes
router.use(protect) // All routes after this middleware require authentication

router.get("/me", getMe)
router.patch("/update-me", validateRequest(updateMeSchema), updateMe)
router.patch("/update-password", validateRequest(updatePasswordSchema), updatePassword)
router.get("/settings", getSettings)
router.patch("/settings", validateRequest(updateSettingsSchema), updateSettings)

export default router
