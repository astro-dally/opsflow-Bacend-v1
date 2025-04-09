import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import mongoSanitize from "express-mongo-sanitize"
import xss from "xss-clean"
import hpp from "hpp"
import compression from "compression"
import cookieParser from "cookie-parser"
import routes from "./src/routes/index.js"
import { errorHandler, notFound } from "./src/middleware/errorMiddleware.js"
import config from "./src/config/config.js"
import { swaggerDocs } from "./src/utils/swagger.js"

// Initialize express app
const app = express()

// Set security HTTP headers
app.use(helmet())

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// CORS configuration - updated to be more permissive for development
const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? true // Allow all origins in development
      : config.corsOrigin || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies to be sent with requests
  maxAge: 86400, // Cache preflight requests for 24 hours
}

app.use(cors(corsOptions))

// Add OPTIONS handling for preflight requests
app.options("*", cors(corsOptions))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 1000 : 100, // Higher limit for development
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
})
app.use("/api", limiter)

// Body parser
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Cookie parser
app.use(cookieParser())

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["status", "priority", "tags", "assignees", "startDate", "endDate"],
  }),
)

// Compression middleware
app.use(compression())

// Simple health check route at root level
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "OpsFloww API is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  })
})

// API routes
app.use("/api/v1", routes)

// Setup Swagger documentation
const PORT = process.env.PORT || 3001
swaggerDocs(app, PORT)

// Handle 404 routes
app.use(notFound)

// Global error handler
app.use(errorHandler)

export default app
