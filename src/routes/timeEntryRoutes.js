import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import {
  getAllTimeEntries,
  getTimeEntry,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  startTimer,
  stopTimer,
  getMyTimeEntries,
  getTimeEntriesByProject,
  getTimeEntriesByTask,
  getTimeStats,
} from "../controllers/timeEntry/timeEntryController.js"

const router = express.Router()

// Protect all routes after this middleware
router.use(protect)

router.route("/my").get(getMyTimeEntries)
router.route("/project/:projectId").get(getTimeEntriesByProject)
router.route("/task/:taskId").get(getTimeEntriesByTask)
router.route("/stats").get(getTimeStats)
router.route("/start").post(startTimer)
router.route("/stop/:id").patch(stopTimer)

router.route("/").get(getAllTimeEntries).post(createTimeEntry)

router.route("/:id").get(getTimeEntry).patch(updateTimeEntry).delete(deleteTimeEntry)

export default router
