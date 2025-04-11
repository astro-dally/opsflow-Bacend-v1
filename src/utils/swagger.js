import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

// Define API version directly
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
      schemas: {
        // Auth schemas
        UserSignup: {
          type: "object",
          required: ["name", "email", "password", "passwordConfirm"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", format: "password", example: "Password123" },
            passwordConfirm: { type: "string", format: "password", example: "Password123" },
            role: { type: "string", enum: ["user", "team-lead", "manager", "admin"], example: "user" },
          },
        },
        UserSignin: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", format: "password", example: "Password123" },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            role: { type: "string", enum: ["user", "team-lead", "manager", "admin"], example: "user" },
            isEmailVerified: { type: "boolean", example: true },
            department: { type: "string", example: "Engineering" },
            position: { type: "string", example: "Frontend Developer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // Project schemas
        Project: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
            name: { type: "string", example: "Website Redesign" },
            description: { type: "string", example: "Redesign the company website with modern UI/UX" },
            status: {
              type: "string",
              enum: ["planning", "active", "on-hold", "completed", "cancelled"],
              example: "active",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
              example: "high",
            },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            owner: { type: "string", example: "60d21b4667d0d8992e610c85" },
            members: {
              type: "array",
              items: { type: "string" },
              example: ["60d21b4667d0d8992e610c85", "60d21b4667d0d8992e610c86"],
            },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["design", "frontend", "ui/ux"],
            },
            progress: { type: "number", example: 25 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // Task schemas
        Task: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
            title: { type: "string", example: "Design mockups" },
            description: { type: "string", example: "Create UI/UX mockups for the project" },
            status: {
              type: "string",
              enum: ["backlog", "todo", "in-progress", "review", "done", "archived"],
              example: "todo",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
              example: "high",
            },
            project: { type: "string", example: "60d21b4667d0d8992e610c85" },
            reporter: { type: "string", example: "60d21b4667d0d8992e610c85" },
            assignees: {
              type: "array",
              items: { type: "string" },
              example: ["60d21b4667d0d8992e610c85"],
            },
            dueDate: { type: "string", format: "date-time" },
            estimatedHours: { type: "number", example: 20 },
            actualHours: { type: "number", example: 18 },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["design", "ui/ux"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // Team schemas
        Team: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
            name: { type: "string", example: "Engineering Team" },
            description: { type: "string", example: "Frontend and Backend Development Team" },
            leader: { type: "string", example: "60d21b4667d0d8992e610c85" },
            members: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  user: { type: "string", example: "60d21b4667d0d8992e610c85" },
                  role: { type: "string", enum: ["member", "manager", "lead", "admin"], example: "member" },
                  joinedAt: { type: "string", format: "date-time" },
                },
              },
            },
            department: { type: "string", example: "Engineering" },
            avatar: { type: "string", example: "team-avatar.jpg" },
            isActive: { type: "boolean", example: true },
            createdBy: { type: "string", example: "60d21b4667d0d8992e610c85" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // Sprint schemas
        Sprint: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
            name: { type: "string", example: "Sprint 1" },
            description: { type: "string", example: "Initial sprint for project setup" },
            project: { type: "string", example: "60d21b4667d0d8992e610c85" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            status: { type: "string", enum: ["planning", "active", "completed", "cancelled"], example: "active" },
            goal: { type: "string", example: "Complete project setup and initial features" },
            createdBy: { type: "string", example: "60d21b4667d0d8992e610c85" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // Board schemas
        Board: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
            name: { type: "string", example: "Project Kanban Board" },
            description: { type: "string", example: "Kanban board for tracking project tasks" },
            project: { type: "string", example: "60d21b4667d0d8992e610c85" },
            type: { type: "string", enum: ["kanban", "scrum", "custom"], example: "kanban" },
            columns: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", example: "To Do" },
                  description: { type: "string", example: "Tasks ready to be worked on" },
                  order: { type: "number", example: 1 },
                  limit: { type: "number", example: 0 },
                  color: { type: "string", example: "#3B82F6" },
                  taskStatus: { type: "string", example: "todo" },
                },
              },
            },
            isDefault: { type: "boolean", example: true },
            createdBy: { type: "string", example: "60d21b4667d0d8992e610c85" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // Time Entry schemas
        TimeEntry: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
            user: { type: "string", example: "60d21b4667d0d8992e610c85" },
            project: { type: "string", example: "60d21b4667d0d8992e610c85" },
            task: { type: "string", example: "60d21b4667d0d8992e610c85" },
            description: { type: "string", example: "Working on frontend components" },
            startTime: { type: "string", format: "date-time" },
            endTime: { type: "string", format: "date-time" },
            duration: { type: "number", example: 120 }, // in minutes
            isBillable: { type: "boolean", example: true },
            billableRate: { type: "number", example: 100 },
            isRunning: { type: "boolean", example: false },
            isManual: { type: "boolean", example: true },
            tags: { type: "array", items: { type: "string" }, example: ["development"] },
            source: { type: "string", enum: ["manual", "timer", "calendar", "pomodoro"], example: "manual" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // Comment schemas
        Comment: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
            content: { type: "string", example: "This looks good, but we need to adjust the colors." },
            user: { type: "string", example: "60d21b4667d0d8992e610c85" },
            task: { type: "string", example: "60d21b4667d0d8992e610c85" },
            project: { type: "string", example: "60d21b4667d0d8992e610c85" },
            parent: { type: "string", example: "60d21b4667d0d8992e610c85" },
            attachments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  filename: { type: "string", example: "screenshot.png" },
                  path: { type: "string", example: "/uploads/screenshot.png" },
                  uploadedAt: { type: "string", format: "date-time" },
                },
              },
            },
            mentions: {
              type: "array",
              items: { type: "string" },
              example: ["60d21b4667d0d8992e610c85"],
            },
            edited: { type: "boolean", example: false },
            editedAt: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // Calendar Event schemas
        CalendarEvent: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
            title: { type: "string", example: "Project Kickoff Meeting" },
            description: { type: "string", example: "Initial project kickoff meeting" },
            startTime: { type: "string", format: "date-time" },
            endTime: { type: "string", format: "date-time" },
            allDay: { type: "boolean", example: false },
            location: { type: "string", example: "Conference Room A" },
            color: { type: "string", example: "#3B82F6" },
            creator: { type: "string", example: "60d21b4667d0d8992e610c85" },
            attendees: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  user: { type: "string", example: "60d21b4667d0d8992e610c85" },
                  status: {
                    type: "string",
                    enum: ["pending", "accepted", "declined", "tentative"],
                    example: "accepted",
                  },
                  responseTime: { type: "string", format: "date-time" },
                },
              },
            },
            project: { type: "string", example: "60d21b4667d0d8992e610c85" },
            task: { type: "string", example: "60d21b4667d0d8992e610c85" },
            type: {
              type: "string",
              enum: ["meeting", "task", "reminder", "deadline", "holiday", "other"],
              example: "meeting",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // Attendance schemas
        Attendance: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
            user: { type: "string", example: "60d21b4667d0d8992e610c85" },
            date: { type: "string", format: "date-time" },
            clockInTime: { type: "string", format: "date-time" },
            clockOutTime: { type: "string", format: "date-time" },
            totalHours: { type: "number", example: 8.5 },
            status: { type: "string", enum: ["present", "absent", "late", "half-day", "leave"], example: "present" },
            notes: { type: "string", example: "" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // Leave schemas
        Leave: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
            user: { type: "string", example: "60d21b4667d0d8992e610c85" },
            leaveType: {
              type: "string",
              enum: ["sick", "vacation", "personal", "bereavement", "unpaid", "other"],
              example: "vacation",
            },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            totalDays: { type: "number", example: 5 },
            reason: { type: "string", example: "Annual vacation" },
            status: { type: "string", enum: ["pending", "approved", "rejected", "cancelled"], example: "approved" },
            approvedBy: { type: "string", example: "60d21b4667d0d8992e610c85" },
            approvedAt: { type: "string", format: "date-time" },
            rejectionReason: { type: "string", example: "" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // Notification schemas
        Notification: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
            recipient: { type: "string", example: "60d21b4667d0d8992e610c85" },
            sender: { type: "string", example: "60d21b4667d0d8992e610c85" },
            type: { type: "string", example: "task-assigned" },
            title: { type: "string", example: "New Task Assigned" },
            description: { type: "string", example: "You have been assigned to a new task" },
            read: { type: "boolean", example: false },
            readAt: { type: "string", format: "date-time" },
            priority: { type: "string", enum: ["low", "medium", "high"], example: "medium" },
            actionLink: { type: "string", example: "/tasks/60d21b4667d0d8992e610c85" },
            relatedModel: { type: "string", example: "Task" },
            relatedId: { type: "string", example: "60d21b4667d0d8992e610c85" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // File schemas
        File: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
            filename: { type: "string", example: "document.pdf" },
            originalName: { type: "string", example: "project-document.pdf" },
            path: { type: "string", example: "/uploads/document.pdf" },
            size: { type: "number", example: 1024000 },
            mimetype: { type: "string", example: "application/pdf" },
            extension: { type: "string", example: "pdf" },
            uploadedBy: { type: "string", example: "60d21b4667d0d8992e610c85" },
            project: { type: "string", example: "60d21b4667d0d8992e610c85" },
            task: { type: "string", example: "60d21b4667d0d8992e610c85" },
            comment: { type: "string", example: "60d21b4667d0d8992e610c85" },
            tags: { type: "array", items: { type: "string" }, example: ["document", "specification"] },
            isPublic: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Authentication information is missing or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "fail" },
                  message: { type: "string", example: "You are not logged in. Please log in to get access." },
                },
              },
            },
          },
        },
        NotFoundError: {
          description: "The specified resource was not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "fail" },
                  message: { type: "string", example: "No resource found with that ID" },
                },
              },
            },
          },
        },
        ValidationError: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "fail" },
                  message: { type: "string", example: "Invalid input data" },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Users", description: "User management endpoints" },
      { name: "Projects", description: "Project management endpoints" },
      { name: "Tasks", description: "Task management endpoints" },
      { name: "Time Entries", description: "Time tracking endpoints" },
      { name: "Teams", description: "Team management endpoints" },
      { name: "Comments", description: "Comment management endpoints" },
      { name: "Sprints", description: "Sprint management endpoints" },
      { name: "Boards", description: "Board management endpoints" },
      { name: "Calendar", description: "Calendar event endpoints" },
      { name: "Reports", description: "Reporting endpoints" },
      { name: "Notifications", description: "Notification endpoints" },
      { name: "Files", description: "File management endpoints" },
      { name: "Attendance", description: "Attendance tracking endpoints" },
      { name: "Leaves", description: "Leave management endpoints" },
      { name: "Diagnostic", description: "System diagnostic endpoints" },
    ],
  },
  apis: ["./src/routes/v1/*.js", "./src/models/*.js", "./src/controllers/**/*.js"],
}

const specs = swaggerJsdoc(options)

export const swaggerDocs = (app, port) => {
  // Swagger page
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "OpsFloww API Documentation",
    }),
  )

  // Docs in JSON format
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json")
    res.send(specs)
  })

  console.log(`Docs available at http://localhost:${port}/api/docs`)
}
