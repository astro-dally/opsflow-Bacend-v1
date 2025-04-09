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
} from "../controllers/auth/authController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public routes
router.post("/signup", signup)
router.post("/signin", signin)
router.post("/logout", logout)
router.post("/forgot-password", forgotPassword)
router.patch("/reset-password/:token", resetPassword)
router.patch("/verify-email/:token", verifyEmail)

// Protected routes
router.use(protect) // All routes after this middleware require authentication

router.get("/me", getMe)
router.patch("/update-me", updateMe)
router.patch("/update-password", updatePassword)
router.get("/settings", getSettings)
router.patch("/settings", updateSettings)

export default router
