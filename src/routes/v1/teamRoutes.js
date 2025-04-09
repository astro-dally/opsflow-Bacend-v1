import express from "express"
import { protect } from "../../middleware/authMiddleware.js"

const router = express.Router()

// Protect all routes after this middleware
router.use(protect)

// GET /api/v1/teams
router.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Teams route is working",
        data: {
            teams: [],
        },
    })
})

// GET /api/v1/teams/:id
router.get("/:id", (req, res) => {
    res.status(200).json({
        status: "success",
        message: `Team with ID ${req.params.id} found`,
        data: {
            team: {
                id: req.params.id,
                name: "Sample Team",
                description: "This is a placeholder team",
            },
        },
    })
})

export default router
