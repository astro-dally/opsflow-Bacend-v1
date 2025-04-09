import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
  getProjectTasks,
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
} from "../controllers/project/projectController.js"

const router = express.Router()

// Protect all routes after this middleware
router.use(protect)

router.route("/stats").get(getProjectStats)

router.route("/").get(getAllProjects).post(createProject)

router.route("/:id").get(getProject).patch(updateProject).delete(deleteProject)

router.route("/:id/tasks").get(getProjectTasks)
router.route("/:id/members").get(getProjectMembers).post(addProjectMember)

router.route("/:id/members/:userId").delete(removeProjectMember)

export default router
