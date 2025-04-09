import express from "express"
import { protect } from "../../middleware/authMiddleware.js"

const router = express.Router()

// Protect all routes after this middleware
router.use(protect)

// GET /api/v1/leaves
router.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Leaves route is working",
        data: {
            leaves: [],
        },
    })
})

export default router
