import express from "express"
import { protect } from "../../middleware/authMiddleware.js"
import { validateRequest } from "../../middleware/validateMiddleware.js"
import { createProjectSchema, updateProjectSchema } from "../../validations/projectValidation.js"
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
  getProjectTasks,
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
} from "../../controllers/project/projectController.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management endpoints
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by project status
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field(s), comma-separated
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Results per page
 *     responses:
 *       200:
 *         description: List of projects
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

// Protect all routes after this middleware
router.use(protect)

router.route("/stats").get(getProjectStats)

router.route("/").get(getAllProjects).post(validateRequest(createProjectSchema), createProject)

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 *   patch:
 *     summary: Update a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectUpdate'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       204:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 */
router.route("/:id").get(getProject).patch(validateRequest(updateProjectSchema), updateProject).delete(deleteProject)

router.route("/:id/tasks").get(getProjectTasks)
router.route("/:id/members").get(getProjectMembers).post(addProjectMember)

router.route("/:id/members/:userId").delete(removeProjectMember)

export default router
