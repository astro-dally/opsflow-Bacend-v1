import express from "express"
import { protect } from "../../middleware/authMiddleware.js"

const router = express.Router()

// Protect all routes after this middleware
router.use(protect)

// GET /api/v1/files
router.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Files route is working",
        data: {
            files: [],
        },
    })
})

export default router
