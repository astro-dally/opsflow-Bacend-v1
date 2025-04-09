import express from "express"
import { protect, restrictTo } from "../../middleware/authMiddleware.js"

const router = express.Router()

// Protect all routes after this middleware
router.use(protect)

// GET /api/v1/users
router.get("/", restrictTo("admin"), (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Users route is working",
    data: {
      users: [],
    },
  })
})

// GET /api/v1/users/:id
router.get("/:id", (req, res) => {
  res.status(200).json({
    status: "success",
    message: `User with ID ${req.params.id} found`,
    data: {
      user: {
        id: req.params.id,
        name: "Sample User",
        email: "user@example.com",
      },
    },
  })
})

export default router
