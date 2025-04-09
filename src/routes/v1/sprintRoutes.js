import express from "express"
import { protect } from "../../middleware/authMiddleware.js"

const router = express.Router()

// Protect all routes after this middleware
router.use(protect)

// GET /api/v1/sprints
router.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Sprints route is working",
        data: {
            sprints: [],
        },
    })
})

export default router
