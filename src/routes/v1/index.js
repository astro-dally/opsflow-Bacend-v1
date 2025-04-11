import express from "express"
import authRoutes from "./authRoutes.js"
import userRoutes from "./userRoutes.js"
import projectRoutes from "./projectRoutes.js"
import taskRoutes from "./taskRoutes.js"
import timeEntryRoutes from "./timeEntryRoutes.js"
import teamRoutes from "./teamRoutes.js"
import commentRoutes from "./commentRoutes.js"
import sprintRoutes from "./sprintRoutes.js"
import boardRoutes from "./boardRoutes.js"
import calendarEventRoutes from "./calendarEventRoutes.js"
import reportRoutes from "./reportRoutes.js"
import notificationRoutes from "./notificationRoutes.js"
import fileRoutes from "./fileRoutes.js"
import attendanceRoutes from "./attendanceRoutes.js"
import leaveRoutes from "./leaveRoutes.js"
import diagnosticRoutes from "./diagnosticRoutes.js"
import seedRoutes from "./seedRoutes.js"

const router = express.Router()

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API v1 is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Diagnostic routes - no authentication required
router.use("/diagnostic", diagnosticRoutes)

// Seed routes - development only
if (process.env.NODE_ENV === "development") {
  router.use("/seed", seedRoutes)
}

// Mount routes
router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/projects", projectRoutes)
router.use("/tasks", taskRoutes)
router.use("/time-entries", timeEntryRoutes)
router.use("/teams", teamRoutes)
router.use("/comments", commentRoutes)
router.use("/sprints", sprintRoutes)
router.use("/boards", boardRoutes)
router.use("/calendar", calendarEventRoutes)
router.use("/reports", reportRoutes)
router.use("/notifications", notificationRoutes)
router.use("/files", fileRoutes)
router.use("/attendance", attendanceRoutes)
router.use("/leaves", leaveRoutes)

export default router
