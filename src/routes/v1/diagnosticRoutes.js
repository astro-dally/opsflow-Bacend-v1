import express from "express"
import mongoose from "mongoose"

const router = express.Router()

// Public diagnostic routes that don't require authentication
router.get("/status", (req, res) => {
    const status = {
        server: "running",
        timestamp: new Date().toISOString(),
        node_version: process.version,
        mongodb: {
            connected: mongoose.connection.readyState === 1,
            state: getMongoConnectionState(mongoose.connection.readyState),
        },
        environment: process.env.NODE_ENV || "development",
    }

    res.status(200).json({
        status: "success",
        data: status,
    })
})

// Test route that doesn't use authentication middleware
router.get("/test-route", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Test route is working",
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
    })
})

// Helper function to get MongoDB connection state
function getMongoConnectionState(state) {
    const states = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
    }
    return states[state] || "unknown"
}

export default router
