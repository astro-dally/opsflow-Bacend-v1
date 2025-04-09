import express from "express"
import v1Routes from "./v1/index.js"

const router = express.Router()

// Health check route
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "API is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    })
})

// API version routes
router.use("/v1", v1Routes)

// For future API versions
// router.use("/v2", v2Routes)

export default router

