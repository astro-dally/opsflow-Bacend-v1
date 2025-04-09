import express from "express"
import { protect } from "../../middleware/authMiddleware.js"
import { validateRequest } from "../../middleware/validateMiddleware.js"
import {
  createTaskSchema,
  updateTaskSchema,
  taskCommentSchema,
  updateTaskStatusSchema,
} from "../../validations/taskValidation.js"
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
} from "../../controllers/task/taskController.js"

const router = express.Router()

// Protect all routes after this middleware
router.use(protect)

router.route("/by-status/:status").get(getTasksByStatus)
router.route("/by-assignee/:userId").get(getTasksByAssignee)

router.route("/").get(getAllTasks).post(validateRequest(createTaskSchema), createTask)

router.route("/:id").get(getTask).patch(validateRequest(updateTaskSchema), updateTask).delete(deleteTask)

router.route("/:id/status").patch(validateRequest(updateTaskStatusSchema), updateTaskStatus)

router.route("/:id/comments").get(getTaskComments).post(validateRequest(taskCommentSchema), addTaskComment)

export default router
