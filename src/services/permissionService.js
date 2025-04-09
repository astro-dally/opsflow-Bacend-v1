/**
 * Permission Service
 *
 * Handles permission checks for different resources and actions
 */
import User from "../models/User.js"
import Project from "../models/Project.js"
import Task from "../models/Task.js"
import Team from "../models/Team.js"
import { catchAsync } from "../utils/catchAsync.js"
import { AppError } from "../utils/appError.js"

/**
 * Get user permissions
 * @param {Object} user - User object
 * @returns {Object} Permission object with can() method
 */
export const getPermissions = async (user) => {
    // Cache user's teams for permission checks
    const userTeams = await Team.find({ "members.user": user._id })

    return {
        /**
         * Check if user can perform action on resource
         * @param {string} resource - Resource name
         * @param {string} action - Action name
         * @param {Object} req - Express request object
         * @returns {boolean} True if user has permission
         */
        can: (resource, action, req) => {
            // Admin can do anything
            if (user.role === "admin") return true

            switch (resource) {
                case "project":
                    return canAccessProject(user, action, req, userTeams)
                case "task":
                    return canAccessTask(user, action, req, userTeams)
                case "user":
                    return canAccessUser(user, action, req)
                case "team":
                    return canAccessTeam(user, action, req, userTeams)
                default:
                    return false
            }
        },
    }
}

/**
 * Check if user can access project
 */
const canAccessProject = (user, action, req, userTeams) => {
    const projectId = req.params.id || req.body.project

    // Team leads and managers can create projects
    if (action === "create" && ["team-lead", "manager"].includes(user.role)) {
        return true
    }

    // For other actions, need to check project membership
    if (projectId) {
        // Check if user is project owner or member
        const project = req.project // Assuming project is loaded by previous middleware

        if (project) {
            if (project.owner.toString() === user._id.toString()) {
                return true // Project owner can do anything
            }

            if (project.members.includes(user._id)) {
                // Project members can read and update but not delete
                return ["read", "update"].includes(action)
            }

            // Check if user is in a team that has access to this project
            const teamHasAccess = userTeams.some((team) => team.projects && team.projects.includes(projectId))

            if (teamHasAccess) {
                return action === "read" // Team members can read
            }
        }
    }

    return false
}

/**
 * Check if user can access task
 */
const canAccessTask = (user, action, req, userTeams) => {
    const taskId = req.params.id || req.body.task

    // Anyone can create tasks
    if (action === "create") {
        return true
    }

    // For other actions, need to check task assignment
    if (taskId) {
        const task = req.task // Assuming task is loaded by previous middleware

        if (task) {
            // Task reporter can do anything
            if (task.reporter.toString() === user._id.toString()) {
                return true
            }

            // Task assignees can read and update
            if (task.assignees.some((assignee) => assignee.toString() === user._id.toString())) {
                return ["read", "update"].includes(action)
            }

            // Project members can read tasks
            if (task.project && req.project && req.project.members.includes(user._id)) {
                return action === "read"
            }
        }
    }

    return false
}

/**
 * Check if user can access another user
 */
const canAccessUser = (user, action, req) => {
    const userId = req.params.id || req.body.user

    // Users can read and update their own profile
    if (userId && userId === user._id.toString()) {
        return ["read", "update"].includes(action)
    }

    // Team leads and managers can read team members
    if (action === "read" && ["team-lead", "manager"].includes(user.role)) {
        return true
    }

    return false
}

/**
 * Check if user can access team
 */
const canAccessTeam = (user, action, req, userTeams) => {
    const teamId = req.params.id || req.body.team

    // Team leads and managers can create teams
    if (action === "create" && ["team-lead", "manager"].includes(user.role)) {
        return true
    }

    // For other actions, need to check team membership
    if (teamId) {
        const team = userTeams.find((t) => t._id.toString() === teamId)

        if (team) {
            // Team leader can do anything
            if (team.leader.toString() === user._id.toString()) {
                return true
            }

            // Team members can read
            const memberRole = team.members.find((m) => m.user.toString() === user._id.toString())

            if (memberRole) {
                // Regular members can read, managers can update
                if (action === "read") return true
                if (action === "update" && memberRole.role === "manager") return true
            }
        }
    }

    return false
}

/**
 * Load resource middleware factory
 * @param {string} model - Model name ('Project', 'Task', etc.)
 * @param {string} paramName - URL parameter name for ID
 * @returns {Function} Middleware function
 */
export const loadResource = (model, paramName = "id") => {
    return catchAsync(async (req, res, next) => {
        const id = req.params[paramName]

        if (!id) return next()

        let Model
        switch (model) {
            case "Project":
                Model = Project
                break
            case "Task":
                Model = Task
                break
            case "User":
                Model = User
                break
            case "Team":
                Model = Team
                break
            default:
                return next()
        }

        const resource = await Model.findById(id)

        if (!resource) {
            return next(new AppError(`No ${model.toLowerCase()} found with that ID`, 404))
        }

        // Store resource in request object
        req[model.toLowerCase()] = resource
        next()
    })
}
