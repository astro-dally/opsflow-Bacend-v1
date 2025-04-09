/**
 * Token Service
 *
 * Handles token blacklisting and validation
 */
import Redis from "ioredis"
import jwt from "jsonwebtoken"
import { promisify } from "util"
import config from "../config/config.js"
import logger from "../utils/logger.js"

// Initialize variables
let redisClient = null
const inMemoryBlacklist = new Map()
let useRedis = false
let hasLoggedRedisWarning = false

// Function to create Redis client with proper error handling
const createRedisClient = () => {
    // Skip if we've already determined Redis is unavailable
    if (hasLoggedRedisWarning) return null

    try {
        const client = new Redis({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.password || undefined,
            connectTimeout: 3000, // 3 seconds timeout
            maxRetriesPerRequest: 1,
            retryStrategy: () => null, // Disable auto-retry
        })

        // Handle connection errors
        client.on("error", (err) => {
            if (!hasLoggedRedisWarning && err.code === "ECONNREFUSED") {
                logger.warn(`Redis not available, using in-memory token blacklist instead. Some features may be limited.`)
                hasLoggedRedisWarning = true
                useRedis = false

                // Close the client to prevent further reconnection attempts
                client.disconnect()
            }
        })

        // Handle successful connection
        client.on("connect", () => {
            logger.info("Redis connected successfully")
            useRedis = true
        })

        return client
    } catch (error) {
        if (!hasLoggedRedisWarning) {
            logger.warn(`Failed to initialize Redis: ${error.message}. Using in-memory token blacklist instead.`)
            hasLoggedRedisWarning = true
        }
        return null
    }
}

// Try to initialize Redis client
redisClient = createRedisClient()

/**
 * Add a token to the blacklist
 * @param {string} token - JWT token
 */
export const addToBlacklist = async (token) => {
    try {
        // Decode token to get expiration time
        const decoded = await promisify(jwt.verify)(token, config.jwt.secret)

        // Calculate TTL (time to live) in seconds
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)

        if (expiresIn > 0) {
            if (useRedis && redisClient && redisClient.status === "ready") {
                // Add token to Redis blacklist with expiry matching the token expiry
                await redisClient.set(`bl_${token}`, "1", "EX", expiresIn)
            } else {
                // Use in-memory blacklist as fallback
                inMemoryBlacklist.set(token, true)

                // Set timeout to remove from blacklist when token expires
                setTimeout(() => {
                    inMemoryBlacklist.delete(token)
                }, expiresIn * 1000)
            }
        }
    } catch (error) {
        logger.error(`Error blacklisting token: ${error.message}`)
    }
}

/**
 * Check if a token is blacklisted
 * @param {string} token - JWT token
 * @returns {boolean} True if token is blacklisted
 */
export const isBlacklisted = async (token) => {
    try {
        if (useRedis && redisClient && redisClient.status === "ready") {
            const result = await redisClient.get(`bl_${token}`)
            return !!result
        } else {
            // Use in-memory blacklist as fallback
            return inMemoryBlacklist.has(token)
        }
    } catch (error) {
        logger.error(`Error checking blacklisted token: ${error.message}`)
        return false
    }
}

/**
 * Close Redis connection (for graceful shutdown)
 */
export const closeConnection = async () => {
    if (redisClient) {
        try {
            await redisClient.quit()
            logger.info("Redis connection closed")
        } catch (error) {
            logger.error(`Error closing Redis connection: ${error.message}`)
        }
    }
}
