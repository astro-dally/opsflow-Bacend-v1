import "dotenv/config"
import mongoose from "mongoose"
import app from "./app.js"
import logger from "./src/utils/logger.js"
import { closeConnection as closeRedisConnection } from "./src/services/tokenService.js"

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET", "MONGO_URI"]
const missingEnvVars = requiredEnvVars.filter((env) => !process.env[env])

if (missingEnvVars.length > 0) {
  logger.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`)
  process.exit(1)
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("MongoDB connected successfully")

    // Start server
    const PORT = process.env.PORT || 3001
    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`)
      logger.info(`API is available at http://localhost:${PORT}/api/v1`)
    })

    // Handle graceful shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`)

      server.close(async () => {
        logger.info("HTTP server closed")

        try {
          await mongoose.connection.close()
          logger.info("MongoDB connection closed")

          await closeRedisConnection()
          logger.info("Redis connection closed")

          process.exit(0)
        } catch (err) {
          logger.error(`Error during shutdown: ${err.message}`)
          process.exit(1)
        }
      })
    }

    // Listen for termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
    process.on("SIGINT", () => gracefulShutdown("SIGINT"))
  })
  .catch((err) => {
    logger.error(`Error connecting to MongoDB: ${err.message}`)
    process.exit(1)
  })

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Promise Rejection: ${err.message}`)
  logger.error(err.stack)
  // Don't exit the process in production, just log the error
  if (process.env.NODE_ENV !== "production") {
    process.exit(1)
  }
})

export default app
