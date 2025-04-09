import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
  getTasksByAssignee,
  updateTaskStatus,
  addTaskComment,
  getTaskComments,
} from "../controllers/task/taskController.js"

const router = express.Router()

// Protect all routes after this middleware
router.use(protect)

router.route("/by-status/:status").get(getTasksByStatus)
router.route("/by-assignee/:userId").get(getTasksByAssignee)

router.route("/").get(getAllTasks).post(createTask)

router.route("/:id").get(getTask).patch(updateTask).delete(deleteTask)

router.route("/:id/status").patch(updateTaskStatus)

router.route("/:id/comments").get(getTaskComments).post(addTaskComment)

export default router
