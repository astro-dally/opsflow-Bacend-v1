import "dotenv/config"
import mongoose from "mongoose"
import { seedAllData, clearAllData } from "./src/utils/seedData.js"
import logger from "./src/utils/logger.js"

// Check if MongoDB URI is provided
if (!process.env.MONGO_URI) {
    logger.error("MONGO_URI environment variable is required")
    process.exit(1)
}

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        logger.info(`Connected to MongoDB cluster: ${process.env.MONGO_URI}`)

        try {
            // Check if --clear flag is provided
            const shouldClear = process.argv.includes("--clear")

            if (shouldClear) {
                // Confirm before clearing data
                logger.warn("WARNING: You are about to clear all data from the database!")
                logger.warn("This action cannot be undone.")

                // Wait for user confirmation
                const readline = require("readline").createInterface({
                    input: process.stdin,
                    output: process.stdout,
                })

                const answer = await new Promise((resolve) => {
                    readline.question("Are you sure you want to proceed? (yes/no): ", resolve)
                })

                readline.close()

                if (answer.toLowerCase() !== "yes") {
                    logger.info("Operation cancelled.")
                    process.exit(0)
                }

                await clearAllData()
            }

            // Seed data
            const result = await seedAllData()

            logger.info("Data seeding completed successfully!")
            logger.info("Summary of created data:")
            console.table(result)

            process.exit(0)
        } catch (error) {
            logger.error(`Error: ${error.message}`)
            logger.error(error.stack)
            process.exit(1)
        }
    })
    .catch((err) => {
        logger.error(`Error connecting to MongoDB: ${err.message}`)
        process.exit(1)
    })
