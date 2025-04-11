import express from "express"
import { seedAllData, clearAllData } from "../../utils/seedData.js"
import logger from "../../utils/logger.js"

const router = express.Router()

/**
 * @swagger
 * /seed:
 *   post:
 *     summary: Seed the database with sample data
 *     tags: [Diagnostic]
 *     description: Populates the database with sample data for testing. Only available in development environment.
 *     responses:
 *       200:
 *         description: Data seeded successfully
 *       403:
 *         description: Forbidden in production environment
 */
router.post("/", async (req, res, next) => {
    try {
        // Only allow in development environment
        if (process.env.NODE_ENV !== "development") {
            return res.status(403).json({
                status: "error",
                message: "Seeding is only allowed in development environment",
            })
        }

        logger.info("Seeding data via API request")
        const result = await seedAllData()

        res.status(200).json({
            status: "success",
            message: "Data seeded successfully",
            data: result,
        })
    } catch (error) {
        next(error)
    }
})

/**
 * @swagger
 * /seed:
 *   delete:
 *     summary: Clear all data from the database
 *     tags: [Diagnostic]
 *     description: Removes all data from the database. Only available in development environment.
 *     responses:
 *       200:
 *         description: All data cleared successfully
 *       403:
 *         description: Forbidden in production environment
 */
router.delete("/", async (req, res, next) => {
    try {
        // Only allow in development environment
        if (process.env.NODE_ENV !== "development") {
            return res.status(403).json({
                status: "error",
                message: "Clearing data is only allowed in development environment",
            })
        }

        logger.warn("Clearing all data via API request")
        await clearAllData()

        res.status(200).json({
            status: "success",
            message: "All data cleared successfully",
        })
    } catch (error) {
        next(error)
    }
})

export default router
