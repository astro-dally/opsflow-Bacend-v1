import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

// Instead of importing from package.json, define version directly
const API_VERSION = "1.0.0"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "OpsFloww API Documentation",
      version: API_VERSION,
      description: "API documentation for the OpsFloww project management system",
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
      contact: {
        name: "OpsFloww Team",
        url: "https://opsfloww.com",
        email: "support@opsfloww.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3001/api/v1",
        description: "Development server",
      },
      {
        url: "https://api.opsfloww.com/api/v1",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/v1/*.js", "./src/models/*.js"],
}

const specs = swaggerJsdoc(options)

export const swaggerDocs = (app, port) => {
  // Swagger page
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs))

  // Docs in JSON format
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json")
    res.send(specs)
  })

  console.log(`Docs available at http://localhost:${port}/api/docs`)
}
