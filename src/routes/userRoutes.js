import express from "express"
import { protect, restrictTo } from "../middleware/authMiddleware.js"
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
} from "../controllers/user/userController.js"

const router = express.Router()

// Protect all routes after this middleware
router.use(protect)

// Admin only routes
router.use(restrictTo("admin"))

router.route("/stats").get(getUserStats)
router.route("/").get(getAllUsers).post(createUser)

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser)

export default router
