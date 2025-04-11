/**
 * Comprehensive Data Seeding Utility
 *
 * This module provides functions to seed the database with test data for all models
 */
import mongoose from "mongoose"
import User from "../models/User.js"
import Project from "../models/Project.js"
import Task from "../models/Task.js"
import Team from "../models/Team.js"
import Comment from "../models/Comment.js"
import Sprint from "../models/Sprint.js"
import Board from "../models/Board.js"
import CalendarEvent from "../models/CalendarEvent.js"
import Notification from "../models/Notification.js"
import Attendance from "../models/Attendance.js"
import Leave from "../models/Leave.js"
import TimeEntry from "../models/TimeEntry.js"
import logger from "./logger.js"

/**
 * Seed users
 * @returns {Promise<Array>} Created users
 */
export const seedUsers = async () => {
    try {
        logger.info("Seeding users...")

        // Check if users already exist
        const userCount = await User.countDocuments()
        if (userCount > 0) {
            logger.info(`Users already exist (${userCount} found). Skipping user seeding.`)
            return await User.find().select("-password")
        }

        // Create admin user
        const adminUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "Password123",
            passwordConfirm: "Password123",
            role: "admin",
            isEmailVerified: true,
            department: "Management",
            position: "System Administrator",
        })

        // Create manager user
        const managerUser = await User.create({
            name: "Manager User",
            email: "manager@example.com",
            password: "Password123",
            passwordConfirm: "Password123",
            role: "manager",
            isEmailVerified: true,
            department: "Product",
            position: "Product Manager",
        })

        // Create team lead user
        const teamLeadUser = await User.create({
            name: "Team Lead",
            email: "teamlead@example.com",
            password: "Password123",
            passwordConfirm: "Password123",
            role: "team-lead",
            isEmailVerified: true,
            department: "Engineering",
            position: "Senior Developer",
        })

        // Create regular users
        const regularUsers = await User.create([
            {
                name: "John Doe",
                email: "john@example.com",
                password: "Password123",
                passwordConfirm: "Password123",
                role: "user",
                isEmailVerified: true,
                department: "Engineering",
                position: "Frontend Developer",
            },
            {
                name: "Jane Smith",
                email: "jane@example.com",
                password: "Password123",
                passwordConfirm: "Password123",
                role: "user",
                isEmailVerified: true,
                department: "Engineering",
                position: "Backend Developer",
            },
            {
                name: "Bob Johnson",
                email: "bob@example.com",
                password: "Password123",
                passwordConfirm: "Password123",
                role: "user",
                isEmailVerified: true,
                department: "Design",
                position: "UI/UX Designer",
            },
            {
                name: "Alice Williams",
                email: "alice@example.com",
                password: "Password123",
                passwordConfirm: "Password123",
                role: "user",
                isEmailVerified: true,
                department: "QA",
                position: "QA Engineer",
            },
        ])

        const allUsers = [adminUser, managerUser, teamLeadUser, ...regularUsers]
        logger.info(`Created ${allUsers.length} users`)

        return allUsers.map((user) => {
            const userObj = user.toObject()
            delete userObj.password
            return userObj
        })
    } catch (error) {
        logger.error(`Error seeding users: ${error.message}`)
        throw error
    }
}

/**
 * Seed teams
 * @param {Array} users - User objects
 * @returns {Promise<Array>} Created teams
 */
export const seedTeams = async (users) => {
    try {
        logger.info("Seeding teams...")

        // Check if teams already exist
        const teamCount = await Team.countDocuments()
        if (teamCount > 0) {
            logger.info(`Teams already exist (${teamCount} found). Skipping team seeding.`)
            return await Team.find()
        }

        if (!users || users.length === 0) {
            users = await User.find().select("-password")
            if (users.length === 0) {
                throw new Error("No users found. Please seed users first.")
            }
        }

        const adminUser = users.find((user) => user.role === "admin")
        const managerUser = users.find((user) => user.role === "manager")
        const teamLeadUser = users.find((user) => user.role === "team-lead")
        const regularUsers = users.filter((user) => user.role === "user")

        // Create teams
        const teams = await Team.create([
            {
                name: "Engineering Team",
                description: "Frontend and Backend Development Team",
                leader: teamLeadUser._id,
                members: [
                    {
                        user: teamLeadUser._id,
                        role: "lead",
                        joinedAt: new Date(),
                    },
                    {
                        user: regularUsers[0]._id,
                        role: "member",
                        joinedAt: new Date(),
                    },
                    {
                        user: regularUsers[1]._id,
                        role: "member",
                        joinedAt: new Date(),
                    },
                ],
                department: "Engineering",
                createdBy: adminUser._id,
            },
            {
                name: "Design Team",
                description: "UI/UX Design Team",
                leader: regularUsers[2]._id,
                members: [
                    {
                        user: regularUsers[2]._id,
                        role: "lead",
                        joinedAt: new Date(),
                    },
                    {
                        user: regularUsers[3]._id,
                        role: "member",
                        joinedAt: new Date(),
                    },
                ],
                department: "Design",
                createdBy: adminUser._id,
            },
            {
                name: "QA Team",
                description: "Quality Assurance Team",
                leader: regularUsers[3]._id,
                members: [
                    {
                        user: regularUsers[3]._id,
                        role: "lead",
                        joinedAt: new Date(),
                    },
                    {
                        user: regularUsers[0]._id,
                        role: "member",
                        joinedAt: new Date(),
                    },
                ],
                department: "QA",
                createdBy: adminUser._id,
            },
        ])

        logger.info(`Created ${teams.length} teams`)
        return teams
    } catch (error) {
        logger.error(`Error seeding teams: ${error.message}`)
        throw error
    }
}

/**
 * Seed projects
 * @param {Array} users - User objects
 * @param {Array} teams - Team objects
 * @returns {Promise<Array>} Created projects
 */
export const seedProjects = async (users, teams) => {
    try {
        logger.info("Seeding projects...")

        // Check if projects already exist
        const projectCount = await Project.countDocuments()
        if (projectCount > 0) {
            logger.info(`Projects already exist (${projectCount} found). Skipping project seeding.`)
            return await Project.find()
        }

        if (!users || users.length === 0) {
            users = await User.find().select("-password")
            if (users.length === 0) {
                throw new Error("No users found. Please seed users first.")
            }
        }

        if (!teams || teams.length === 0) {
            teams = await Team.find()
        }

        const managerUser = users.find((user) => user.role === "manager")
        const teamLeadUser = users.find((user) => user.role === "team-lead")
        const regularUsers = users.filter((user) => user.role === "user")

        // Create projects
        const projects = await Project.create([
            {
                name: "Website Redesign",
                description: "Redesign the company website with modern UI/UX",
                status: "active",
                priority: "high",
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                owner: managerUser._id,
                members: [managerUser._id, teamLeadUser._id, ...regularUsers.slice(0, 2).map((u) => u._id)],
                client: {
                    name: "Acme Corporation",
                    email: "contact@acme.com",
                    phone: "123-456-7890",
                    company: "Acme Corporation",
                },
                budget: {
                    amount: 25000,
                    currency: "USD",
                },
                tags: ["design", "frontend", "ui/ux"],
                progress: 25,
            },
            {
                name: "Mobile App Development",
                description: "Develop a mobile app for iOS and Android",
                status: "planning",
                priority: "medium",
                startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
                endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
                owner: teamLeadUser._id,
                members: [teamLeadUser._id, ...regularUsers.slice(1, 3).map((u) => u._id)],
                client: {
                    name: "TechStart Inc",
                    email: "info@techstart.com",
                    phone: "987-654-3210",
                    company: "TechStart Inc",
                },
                budget: {
                    amount: 50000,
                    currency: "USD",
                },
                tags: ["mobile", "app", "development"],
                progress: 0,
            },
            {
                name: "API Integration",
                description: "Integrate third-party APIs into our platform",
                status: "active",
                priority: "urgent",
                startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
                endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
                owner: teamLeadUser._id,
                members: [teamLeadUser._id, ...regularUsers.slice(0, 3).map((u) => u._id)],
                client: {
                    name: "DataSync Corp",
                    email: "support@datasync.com",
                    phone: "555-123-4567",
                    company: "DataSync Corp",
                },
                budget: {
                    amount: 15000,
                    currency: "USD",
                },
                tags: ["api", "backend", "integration"],
                progress: 40,
            },
        ])

        logger.info(`Created ${projects.length} projects`)
        return projects
    } catch (error) {
        logger.error(`Error seeding projects: ${error.message}`)
        throw error
    }
}

/**
 * Seed sprints
 * @param {Array} projects - Project objects
 * @param {Array} users - User objects
 * @returns {Promise<Array>} Created sprints
 */
export const seedSprints = async (projects, users) => {
    try {
        logger.info("Seeding sprints...")

        // Check if sprints already exist
        const sprintCount = await Sprint.countDocuments()
        if (sprintCount > 0) {
            logger.info(`Sprints already exist (${sprintCount} found). Skipping sprint seeding.`)
            return await Sprint.find()
        }

        if (!projects || projects.length === 0) {
            projects = await Project.find()
            if (projects.length === 0) {
                throw new Error("No projects found. Please seed projects first.")
            }
        }

        if (!users || users.length === 0) {
            users = await User.find().select("-password")
            if (users.length === 0) {
                throw new Error("No users found. Please seed users first.")
            }
        }

        const sprints = []

        // Create sprints for each project
        for (const project of projects) {
            const projectSprints = await Sprint.create([
                {
                    name: `${project.name} Sprint 1`,
                    description: "Initial sprint for project setup and planning",
                    project: project._id,
                    startDate: new Date(project.startDate),
                    endDate: new Date(new Date(project.startDate).getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks after start
                    status: "completed",
                    goal: "Set up project infrastructure and define requirements",
                    createdBy: project.owner,
                },
                {
                    name: `${project.name} Sprint 2`,
                    description: "Core feature development",
                    project: project._id,
                    startDate: new Date(new Date(project.startDate).getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks after start
                    endDate: new Date(new Date(project.startDate).getTime() + 28 * 24 * 60 * 60 * 1000), // 4 weeks after start
                    status: project.status === "active" ? "active" : "planning",
                    goal: "Implement core features and functionality",
                    createdBy: project.owner,
                },
                {
                    name: `${project.name} Sprint 3`,
                    description: "Testing and refinement",
                    project: project._id,
                    startDate: new Date(new Date(project.startDate).getTime() + 28 * 24 * 60 * 60 * 1000), // 4 weeks after start
                    endDate: new Date(new Date(project.startDate).getTime() + 42 * 24 * 60 * 60 * 1000), // 6 weeks after start
                    status: "planning",
                    goal: "Test and refine implemented features",
                    createdBy: project.owner,
                },
            ])

            sprints.push(...projectSprints)
        }

        logger.info(`Created ${sprints.length} sprints`)
        return sprints
    } catch (error) {
        logger.error(`Error seeding sprints: ${error.message}`)
        throw error
    }
}

/**
 * Seed boards
 * @param {Array} projects - Project objects
 * @param {Array} users - User objects
 * @returns {Promise<Array>} Created boards
 */
export const seedBoards = async (projects, users) => {
    try {
        logger.info("Seeding boards...")

        // Check if boards already exist
        const boardCount = await Board.countDocuments()
        if (boardCount > 0) {
            logger.info(`Boards already exist (${boardCount} found). Skipping board seeding.`)
            return await Board.find()
        }

        if (!projects || projects.length === 0) {
            projects = await Project.find()
            if (projects.length === 0) {
                throw new Error("No projects found. Please seed projects first.")
            }
        }

        if (!users || users.length === 0) {
            users = await User.find().select("-password")
            if (users.length === 0) {
                throw new Error("No users found. Please seed users first.")
            }
        }

        const boards = []

        // Create a board for each project
        for (const project of projects) {
            const board = await Board.create({
                name: `${project.name} Kanban Board`,
                description: `Kanban board for ${project.name}`,
                project: project._id,
                type: "kanban",
                columns: [
                    {
                        name: "Backlog",
                        description: "Tasks that are not yet ready to be worked on",
                        order: 0,
                        taskStatus: "backlog",
                        color: "#6B7280", // Gray
                    },
                    {
                        name: "To Do",
                        description: "Tasks ready to be worked on",
                        order: 1,
                        taskStatus: "todo",
                        color: "#3B82F6", // Blue
                    },
                    {
                        name: "In Progress",
                        description: "Tasks currently being worked on",
                        order: 2,
                        limit: 3, // WIP limit
                        taskStatus: "in-progress",
                        color: "#F59E0B", // Amber
                    },
                    {
                        name: "Review",
                        description: "Tasks ready for review",
                        order: 3,
                        taskStatus: "review",
                        color: "#8B5CF6", // Purple
                    },
                    {
                        name: "Done",
                        description: "Completed tasks",
                        order: 4,
                        taskStatus: "done",
                        color: "#10B981", // Green
                    },
                ],
                isDefault: true,
                createdBy: project.owner,
            })

            boards.push(board)
        }

        logger.info(`Created ${boards.length} boards`)
        return boards
    } catch (error) {
        logger.error(`Error seeding boards: ${error.message}`)
        throw error
    }
}

/**
 * Seed tasks
 * @param {Array} projects - Project objects
 * @param {Array} users - User objects
 * @param {Array} sprints - Sprint objects
 * @param {Array} boards - Board objects
 * @returns {Promise<Array>} Created tasks
 */
export const seedTasks = async (projects, users, sprints, boards) => {
    try {
        logger.info("Seeding tasks...")

        // Check if tasks already exist
        const taskCount = await Task.countDocuments()
        if (taskCount > 0) {
            logger.info(`Tasks already exist (${taskCount} found). Skipping task seeding.`)
            return await Task.find()
        }

        if (!projects || projects.length === 0) {
            projects = await Project.find()
            if (projects.length === 0) {
                throw new Error("No projects found. Please seed projects first.")
            }
        }

        if (!users || users.length === 0) {
            users = await User.find().select("-password")
            if (users.length === 0) {
                throw new Error("No users found. Please seed users first.")
            }
        }

        if (!sprints || sprints.length === 0) {
            sprints = await Sprint.find()
        }

        if (!boards || boards.length === 0) {
            boards = await Board.find()
        }

        const tasks = []

        // Create tasks for each project
        for (const project of projects) {
            const projectSprints = sprints.filter((sprint) => sprint.project.toString() === project._id.toString())
            const projectBoard = boards.find((board) => board.project.toString() === project._id.toString())
            const projectMembers = users.filter((user) => project.members.includes(user._id))

            // Get board columns
            const backlogColumn = projectBoard?.columns.find((col) => col.taskStatus === "backlog")
            const todoColumn = projectBoard?.columns.find((col) => col.taskStatus === "todo")
            const inProgressColumn = projectBoard?.columns.find((col) => col.taskStatus === "in-progress")
            const reviewColumn = projectBoard?.columns.find((col) => col.taskStatus === "review")
            const doneColumn = projectBoard?.columns.find((col) => col.taskStatus === "done")

            // Create tasks for Sprint 1 (completed)
            if (projectSprints.length > 0) {
                const sprint1 = projectSprints[0]
                const sprint1Tasks = await Task.create([
                    {
                        title: "Project Setup",
                        description: "Set up project repository and development environment",
                        status: "done",
                        priority: "high",
                        project: project._id,
                        sprint: sprint1._id,
                        reporter: project.owner,
                        assignees: [projectMembers[0]._id],
                        dueDate: new Date(sprint1.startDate.getTime() + 3 * 24 * 60 * 60 * 1000),
                        estimatedHours: 8,
                        actualHours: 6,
                        tags: ["setup", "infrastructure"],
                        boardColumn: doneColumn?._id,
                        order: 0,
                        completedAt: new Date(sprint1.startDate.getTime() + 2 * 24 * 60 * 60 * 1000),
                        checklist: [
                            {
                                title: "Create repository",
                                completed: true,
                                createdAt: new Date(sprint1.startDate),
                            },
                            {
                                title: "Set up CI/CD",
                                completed: true,
                                createdAt: new Date(sprint1.startDate),
                            },
                            {
                                title: "Configure development environment",
                                completed: true,
                                createdAt: new Date(sprint1.startDate),
                            },
                        ],
                    },
                    {
                        title: "Requirements Gathering",
                        description: "Gather and document project requirements",
                        status: "done",
                        priority: "high",
                        project: project._id,
                        sprint: sprint1._id,
                        reporter: project.owner,
                        assignees: [project.owner, projectMembers[1]?._id].filter(Boolean),
                        dueDate: new Date(sprint1.startDate.getTime() + 5 * 24 * 60 * 60 * 1000),
                        estimatedHours: 16,
                        actualHours: 20,
                        tags: ["requirements", "documentation"],
                        boardColumn: doneColumn?._id,
                        order: 1,
                        completedAt: new Date(sprint1.startDate.getTime() + 5 * 24 * 60 * 60 * 1000),
                    },
                    {
                        title: "Database Schema Design",
                        description: "Design database schema for the project",
                        status: "done",
                        priority: "medium",
                        project: project._id,
                        sprint: sprint1._id,
                        reporter: project.owner,
                        assignees: [projectMembers[1]?._id].filter(Boolean),
                        dueDate: new Date(sprint1.startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
                        estimatedHours: 12,
                        actualHours: 10,
                        tags: ["database", "design"],
                        boardColumn: doneColumn?._id,
                        order: 2,
                        completedAt: new Date(sprint1.startDate.getTime() + 6 * 24 * 60 * 60 * 1000),
                    },
                ])
                tasks.push(...sprint1Tasks)
            }

            // Create tasks for Sprint 2 (active or planning)
            if (projectSprints.length > 1) {
                const sprint2 = projectSprints[1]
                const sprint2Tasks = await Task.create([
                    {
                        title: "API Development",
                        description: "Develop core API endpoints",
                        status: sprint2.status === "active" ? "in-progress" : "todo",
                        priority: "high",
                        project: project._id,
                        sprint: sprint2._id,
                        reporter: project.owner,
                        assignees: [projectMembers[1]?._id].filter(Boolean),
                        dueDate: new Date(sprint2.startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
                        estimatedHours: 40,
                        actualHours: sprint2.status === "active" ? 15 : 0,
                        tags: ["api", "backend"],
                        boardColumn: sprint2.status === "active" ? inProgressColumn?._id : todoColumn?._id,
                        order: 0,
                    },
                    {
                        title: "Frontend Components",
                        description: "Develop reusable frontend components",
                        status: sprint2.status === "active" ? "in-progress" : "todo",
                        priority: "medium",
                        project: project._id,
                        sprint: sprint2._id,
                        reporter: project.owner,
                        assignees: [projectMembers[0]?._id].filter(Boolean),
                        dueDate: new Date(sprint2.startDate.getTime() + 10 * 24 * 60 * 60 * 1000),
                        estimatedHours: 30,
                        actualHours: sprint2.status === "active" ? 12 : 0,
                        tags: ["frontend", "components"],
                        boardColumn: sprint2.status === "active" ? inProgressColumn?._id : todoColumn?._id,
                        order: 1,
                    },
                    {
                        title: "Authentication System",
                        description: "Implement user authentication and authorization",
                        status: "todo",
                        priority: "high",
                        project: project._id,
                        sprint: sprint2._id,
                        reporter: project.owner,
                        assignees: [projectMembers[1]?._id, projectMembers[2]?._id].filter(Boolean),
                        dueDate: new Date(sprint2.startDate.getTime() + 12 * 24 * 60 * 60 * 1000),
                        estimatedHours: 24,
                        tags: ["auth", "security"],
                        boardColumn: todoColumn?._id,
                        order: 2,
                    },
                ])
                tasks.push(...sprint2Tasks)
            }

            // Create tasks for Sprint 3 (planning)
            if (projectSprints.length > 2) {
                const sprint3 = projectSprints[2]
                const sprint3Tasks = await Task.create([
                    {
                        title: "Unit Testing",
                        description: "Write unit tests for all components",
                        status: "backlog",
                        priority: "medium",
                        project: project._id,
                        sprint: sprint3._id,
                        reporter: project.owner,
                        assignees: [projectMembers[2]?._id].filter(Boolean),
                        dueDate: new Date(sprint3.startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
                        estimatedHours: 20,
                        tags: ["testing", "quality"],
                        boardColumn: backlogColumn?._id,
                        order: 0,
                    },
                    {
                        title: "Integration Testing",
                        description: "Write integration tests for API endpoints",
                        status: "backlog",
                        priority: "medium",
                        project: project._id,
                        sprint: sprint3._id,
                        reporter: project.owner,
                        assignees: [projectMembers[2]?._id].filter(Boolean),
                        dueDate: new Date(sprint3.startDate.getTime() + 10 * 24 * 60 * 60 * 1000),
                        estimatedHours: 16,
                        tags: ["testing", "api"],
                        boardColumn: backlogColumn?._id,
                        order: 1,
                    },
                    {
                        title: "Performance Optimization",
                        description: "Optimize application performance",
                        status: "backlog",
                        priority: "low",
                        project: project._id,
                        sprint: sprint3._id,
                        reporter: project.owner,
                        assignees: [projectMembers[0]?._id, projectMembers[1]?._id].filter(Boolean),
                        dueDate: new Date(sprint3.startDate.getTime() + 12 * 24 * 60 * 60 * 1000),
                        estimatedHours: 24,
                        tags: ["performance", "optimization"],
                        boardColumn: backlogColumn?._id,
                        order: 2,
                    },
                ])
                tasks.push(...sprint3Tasks)
            }

            // Create some backlog tasks not assigned to sprints
            const backlogTasks = await Task.create([
                {
                    title: "Documentation",
                    description: "Create comprehensive documentation for the project",
                    status: "backlog",
                    priority: "low",
                    project: project._id,
                    reporter: project.owner,
                    dueDate: new Date(project.endDate),
                    estimatedHours: 20,
                    tags: ["documentation"],
                    boardColumn: backlogColumn?._id,
                    order: 3,
                },
                {
                    title: "Deployment Setup",
                    description: "Set up deployment pipeline and environments",
                    status: "backlog",
                    priority: "medium",
                    project: project._id,
                    reporter: project.owner,
                    estimatedHours: 16,
                    tags: ["devops", "deployment"],
                    boardColumn: backlogColumn?._id,
                    order: 4,
                },
            ])
            tasks.push(...backlogTasks)
        }

        logger.info(`Created ${tasks.length} tasks`)
        return tasks
    } catch (error) {
        logger.error(`Error seeding tasks: ${error.message}`)
        throw error
    }
}

/**
 * Seed comments
 * @param {Array} tasks - Task objects
 * @param {Array} users - User objects
 * @returns {Promise<Array>} Created comments
 */
export const seedComments = async (tasks, users) => {
    try {
        logger.info("Seeding comments...")

        // Check if comments already exist
        const commentCount = await Comment.countDocuments()
        if (commentCount > 0) {
            logger.info(`Comments already exist (${commentCount} found). Skipping comment seeding.`)
            return await Comment.find()
        }

        if (!tasks || tasks.length === 0) {
            tasks = await Task.find()
            if (tasks.length === 0) {
                throw new Error("No tasks found. Please seed tasks first.")
            }
        }

        if (!users || users.length === 0) {
            users = await User.find().select("-password")
            if (users.length === 0) {
                throw new Error("No users found. Please seed users first.")
            }
        }

        const comments = []

        // Create comments for completed tasks
        const completedTasks = tasks.filter((task) => task.status === "done")
        for (const task of completedTasks) {
            const taskComments = await Comment.create([
                {
                    content: "I've started working on this task.",
                    user: task.assignees[0],
                    task: task._id,
                    project: task.project,
                },
                {
                    content: "Making good progress. Should be done soon.",
                    user: task.assignees[0],
                    task: task._id,
                    project: task.project,
                },
                {
                    content: "Task completed. Please review.",
                    user: task.reporter,
                    task: task._id,
                    project: task.project,
                },
            ])
            comments.push(...taskComments)
        }

        // Create comments for in-progress tasks
        const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
        for (const task of inProgressTasks) {
            const taskComments = await Comment.create([
                {
                    content: "I'm starting work on this task now.",
                    user: task.assignees[0],
                    task: task._id,
                    project: task.project,
                },
                {
                    content: "How should we approach this? Any suggestions?",
                    user: task.assignees[0],
                    task: task._id,
                    project: task.project,
                },
            ])
            comments.push(...taskComments)
        }

        logger.info(`Created ${comments.length} comments`)
        return comments
    } catch (error) {
        logger.error(`Error seeding comments: ${error.message}`)
        throw error
    }
}

/**
 * Seed time entries
 * @param {Array} tasks - Task objects
 * @param {Array} users - User objects
 * @returns {Promise<Array>} Created time entries
 */
export const seedTimeEntries = async (tasks, users) => {
    try {
        logger.info("Seeding time entries...")

        // Check if time entries already exist
        const timeEntryCount = await TimeEntry.countDocuments()
        if (timeEntryCount > 0) {
            logger.info(`Time entries already exist (${timeEntryCount} found). Skipping time entry seeding.`)
            return await TimeEntry.find()
        }

        if (!tasks || tasks.length === 0) {
            tasks = await Task.find()
            if (tasks.length === 0) {
                throw new Error("No tasks found. Please seed tasks first.")
            }
        }

        if (!users || users.length === 0) {
            users = await User.find().select("-password")
            if (users.length === 0) {
                throw new Error("No users found. Please seed users first.")
            }
        }

        const timeEntries = []

        // Create time entries for completed tasks
        const completedTasks = tasks.filter((task) => task.status === "done")
        for (const task of completedTasks) {
            if (!task.assignees || task.assignees.length === 0) continue

            const user = task.assignees[0]
            const project = task.project

            // Create multiple time entries for each completed task
            const taskTimeEntries = await TimeEntry.create([
                {
                    user,
                    project,
                    task: task._id,
                    description: `Initial work on ${task.title}`,
                    startTime: new Date(task.createdAt.getTime() + 1 * 24 * 60 * 60 * 1000),
                    endTime: new Date(task.createdAt.getTime() + 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
                    isBillable: true,
                    billableRate: 100,
                    isManual: true,
                    tags: ["development"],
                    source: "manual",
                },
                {
                    user,
                    project,
                    task: task._id,
                    description: `Continued work on ${task.title}`,
                    startTime: new Date(task.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000),
                    endTime: new Date(task.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
                    isBillable: true,
                    billableRate: 100,
                    isManual: true,
                    tags: ["development"],
                    source: "manual",
                },
                {
                    user,
                    project,
                    task: task._id,
                    description: `Finishing ${task.title}`,
                    startTime: new Date(task.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000),
                    endTime: new Date(task.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
                    isBillable: true,
                    billableRate: 100,
                    isManual: true,
                    tags: ["development"],
                    source: "manual",
                },
            ])
            timeEntries.push(...taskTimeEntries)
        }

        // Create time entries for in-progress tasks
        const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
        for (const task of inProgressTasks) {
            if (!task.assignees || task.assignees.length === 0) continue

            const user = task.assignees[0]
            const project = task.project

            // Create time entries for in-progress tasks
            const taskTimeEntries = await TimeEntry.create([
                {
                    user,
                    project,
                    task: task._id,
                    description: `Started working on ${task.title}`,
                    startTime: new Date(task.createdAt.getTime() + 1 * 24 * 60 * 60 * 1000),
                    endTime: new Date(task.createdAt.getTime() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
                    isBillable: true,
                    billableRate: 100,
                    isManual: true,
                    tags: ["development"],
                    source: "manual",
                },
                {
                    user,
                    project,
                    task: task._id,
                    description: `Continuing work on ${task.title}`,
                    startTime: new Date(task.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000),
                    endTime: new Date(task.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
                    isBillable: true,
                    billableRate: 100,
                    isManual: true,
                    tags: ["development"],
                    source: "manual",
                },
            ])
            timeEntries.push(...taskTimeEntries)
        }

        logger.info(`Created ${timeEntries.length} time entries`)
        return timeEntries
    } catch (error) {
        logger.error(`Error seeding time entries: ${error.message}`)
        throw error
    }
}

/**
 * Seed calendar events
 * @param {Array} projects - Project objects
 * @param {Array} users - User objects
 * @returns {Promise<Array>} Created calendar events
 */
export const seedCalendarEvents = async (projects, users) => {
    try {
        logger.info("Seeding calendar events...")

        // Check if calendar events already exist
        const eventCount = await CalendarEvent.countDocuments()
        if (eventCount > 0) {
            logger.info(`Calendar events already exist (${eventCount} found). Skipping calendar event seeding.`)
            return await CalendarEvent.find()
        }

        if (!projects || projects.length === 0) {
            projects = await Project.find()
            if (projects.length === 0) {
                throw new Error("No projects found. Please seed projects first.")
            }
        }

        if (!users || users.length === 0) {
            users = await User.find().select("-password")
            if (users.length === 0) {
                throw new Error("No users found. Please seed users first.")
            }
        }

        const events = []

        // Create calendar events for each project
        for (const project of projects) {
            const projectMembers = users.filter((user) => project.members.includes(user._id))

            // Create project kickoff meeting
            const kickoffEvent = await CalendarEvent.create({
                title: `${project.name} Kickoff Meeting`,
                description: "Initial project kickoff meeting to discuss goals and timeline",
                startTime: new Date(project.startDate),
                endTime: new Date(new Date(project.startDate).getTime() + 1 * 60 * 60 * 1000), // 1 hour meeting
                location: "Conference Room A",
                creator: project.owner,
                attendees: projectMembers.map((user) => ({
                    user: user._id,
                    status: "accepted",
                })),
                project: project._id,
                type: "meeting",
            })
            events.push(kickoffEvent)

            // Create weekly status meeting
            const statusEvent = await CalendarEvent.create({
                title: `${project.name} Weekly Status Meeting`,
                description: "Weekly team status update",
                startTime: new Date(new Date(project.startDate).getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week after start
                endTime: new Date(new Date(project.startDate).getTime() + 7 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000), // 1 hour meeting
                location: "Conference Room B",
                creator: project.owner,
                attendees: projectMembers.map((user) => ({
                    user: user._id,
                    status: "accepted",
                })),
                project: project._id,
                type: "meeting",
                recurrence: {
                    enabled: true,
                    frequency: "weekly",
                    interval: 1,
                    daysOfWeek: [1], // Monday
                    endDate: project.endDate,
                },
            })
            events.push(statusEvent)

            // Create project deadline reminder
            const deadlineEvent = await CalendarEvent.create({
                title: `${project.name} Deadline`,
                description: "Project deadline",
                startTime: new Date(project.endDate),
                endTime: new Date(project.endDate),
                allDay: true,
                creator: project.owner,
                attendees: projectMembers.map((user) => ({
                    user: user._id,
                    status: "accepted",
                })),
                project: project._id,
                type: "deadline",
                reminders: [
                    {
                        time: {
                            value: 1,
                            unit: "days",
                        },
                        type: "notification",
                    },
                    {
                        time: {
                            value: 1,
                            unit: "weeks",
                        },
                        type: "email",
                    },
                ],
            })
            events.push(deadlineEvent)
        }

        logger.info(`Created ${events.length} calendar events`)
        return events
    } catch (error) {
        logger.error(`Error seeding calendar events: ${error.message}`)
        throw error
    }
}

/**
 * Seed attendance records
 * @param {Array} users - User objects
 * @returns {Promise<Array>} Created attendance records
 */
export const seedAttendance = async (users) => {
    try {
        logger.info("Seeding attendance records...")

        // Check if attendance records already exist
        const attendanceCount = await Attendance.countDocuments()
        if (attendanceCount > 0) {
            logger.info(`Attendance records already exist (${attendanceCount} found). Skipping attendance seeding.`)
            return await Attendance.find()
        }

        if (!users || users.length === 0) {
            users = await User.find().select("-password")
            if (users.length === 0) {
                throw new Error("No users found. Please seed users first.")
            }
        }

        const attendance = []
        const today = new Date()

        // Create attendance records for the past 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)

            // Skip weekends
            const dayOfWeek = date.getDay()
            if (dayOfWeek === 0 || dayOfWeek === 6) continue

            // Create attendance for each user
            for (const user of users) {
                // Randomly determine if user was present
                const isPresent = Math.random() > 0.1 // 90% chance of being present

                if (isPresent) {
                    const clockInTime = new Date(date)
                    clockInTime.setHours(9, Math.floor(Math.random() * 30), 0, 0) // Between 9:00 and 9:29

                    const clockOutTime = new Date(date)
                    clockOutTime.setHours(17, 30 + Math.floor(Math.random() * 30), 0, 0) // Between 17:30 and 17:59

                    const record = await Attendance.create({
                        user: user._id,
                        date,
                        clockInTime,
                        clockOutTime,
                        status: clockInTime.getHours() >= 9 && clockInTime.getMinutes() >= 15 ? "late" : "present",
                        notes: clockInTime.getHours() >= 9 && clockInTime.getMinutes() >= 15 ? "Arrived late" : "",
                        location: {
                            coordinates: [Math.random() * 180 - 90, Math.random() * 360 - 180],
                            address: "Office Location",
                        },
                        ipAddress: "192.168.1." + Math.floor(Math.random() * 255),
                        device: "Web Browser",
                    })
                    attendance.push(record)
                } else {
                    // Create absent record
                    const record = await Attendance.create({
                        user: user._id,
                        date,
                        status: "absent",
                        notes: "Absent without notice",
                    })
                    attendance.push(record)
                }
            }
        }

        logger.info(`Created ${attendance.length} attendance records`)
        return attendance
    } catch (error) {
        logger.error(`Error seeding attendance records: ${error.message}`)
        throw error
    }
}

/**
 * Seed leave requests
 * @param {Array} users - User objects
 * @returns {Promise<Array>} Created leave requests
 */
export const seedLeaves = async (users) => {
    try {
        logger.info("Seeding leave requests...")

        // Check if leave requests already exist
        const leaveCount = await Leave.countDocuments()
        if (leaveCount > 0) {
            logger.info(`Leave requests already exist (${leaveCount} found). Skipping leave seeding.`)
            return await Leave.find()
        }

        if (!users || users.length === 0) {
            users = await User.find().select("-password")
            if (users.length === 0) {
                throw new Error("No users found. Please seed users first.")
            }
        }

        const adminUser = users.find((user) => user.role === "admin")
        const managerUser = users.find((user) => user.role === "manager")
        const regularUsers = users.filter((user) => user.role === "user")

        const leaves = []
        const today = new Date()

        // Create approved leave in the past
        for (const user of regularUsers.slice(0, 2)) {
            const startDate = new Date(today)
            startDate.setDate(startDate.getDate() - 14) // 2 weeks ago

            const endDate = new Date(startDate)
            endDate.setDate(endDate.getDate() + 2) // 3-day leave

            const leave = await Leave.create({
                user: user._id,
                leaveType: "vacation",
                startDate,
                endDate,
                reason: "Annual vacation",
                status: "approved",
                approvedBy: managerUser._id,
                approvedAt: new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000), // Approved 1 week before
            })
            leaves.push(leave)
        }

        // Create pending leave in the future
        for (const user of regularUsers.slice(2, 4)) {
            const startDate = new Date(today)
            startDate.setDate(startDate.getDate() + 14) // 2 weeks from now

            const endDate = new Date(startDate)
            endDate.setDate(endDate.getDate() + 4) // 5-day leave

            const leave = await Leave.create({
                user: user._id,
                leaveType: "vacation",
                startDate,
                endDate,
                reason: "Family vacation",
                status: "pending",
            })
            leaves.push(leave)
        }

        // Create rejected leave
        const rejectedLeave = await Leave.create({
            user: regularUsers[0]._id,
            leaveType: "personal",
            startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
            endDate: new Date(today.getTime() - 25 * 24 * 60 * 60 * 1000), // 5 days later
            reason: "Personal matters",
            status: "rejected",
            approvedBy: managerUser._id,
            approvedAt: new Date(today.getTime() - 35 * 24 * 60 * 60 * 1000), // 5 days before start
            rejectionReason: "Critical project deadline during this period",
        })
        leaves.push(rejectedLeave)

        // Create sick leave
        const sickLeave = await Leave.create({
            user: regularUsers[1]._id,
            leaveType: "sick",
            startDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            endDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 2 days later
            reason: "Flu",
            status: "approved",
            approvedBy: managerUser._id,
            approvedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // Approved on end date
        })
        leaves.push(sickLeave)

        logger.info(`Created ${leaves.length} leave requests`)
        return leaves
    } catch (error) {
        logger.error(`Error seeding leave requests: ${error.message}`)
        throw error
    }
}

/**
 * Seed notifications
 * @param {Array} users - User objects
 * @param {Array} tasks - Task objects
 * @param {Array} projects - Project objects
 * @returns {Promise<Array>} Created notifications
 */
export const seedNotifications = async (users, tasks, projects) => {
    try {
        logger.info("Seeding notifications...")

        // Check if notifications already exist
        const notificationCount = await Notification.countDocuments()
        if (notificationCount > 0) {
            logger.info(`Notifications already exist (${notificationCount} found). Skipping notification seeding.`)
            return await Notification.find()
        }

        if (!users || users.length === 0) {
            users = await User.find().select("-password")
            if (users.length === 0) {
                throw new Error("No users found. Please seed users first.")
            }
        }

        if (!tasks || tasks.length === 0) {
            tasks = await Task.find()
        }

        if (!projects || projects.length === 0) {
            projects = await Project.find()
        }

        const notifications = []

        // Create task assignment notifications
        for (const task of tasks.slice(0, 5)) {
            if (!task.assignees || task.assignees.length === 0) continue

            const notification = await Notification.create({
                recipient: task.assignees[0],
                sender: task.reporter,
                type: "task-assigned",
                title: "New Task Assigned",
                description: `You have been assigned to the task: ${task.title}`,
                read: Math.random() > 0.5, // 50% chance of being read
                readAt: Math.random() > 0.5 ? new Date() : undefined,
                priority: task.priority === "high" || task.priority === "urgent" ? "high" : "medium",
                actionLink: `/tasks/${task._id}`,
                relatedModel: "Task",
                relatedId: task._id,
            })
            notifications.push(notification)
        }

        // Create comment notifications
        const comments = await Comment.find().limit(5)
        for (const comment of comments) {
            const task = tasks.find((t) => t._id.toString() === comment.task?.toString())
            if (!task || !task.assignees || task.assignees.length === 0) continue

            // Notify all assignees except the commenter
            for (const assigneeId of task.assignees) {
                if (assigneeId.toString() === comment.user.toString()) continue

                const notification = await Notification.create({
                    recipient: assigneeId,
                    sender: comment.user,
                    type: "comment-added",
                    title: "New Comment",
                    description: `New comment on task: ${task.title}`,
                    read: Math.random() > 0.7, // 30% chance of being read
                    readAt: Math.random() > 0.7 ? new Date() : undefined,
                    priority: "medium",
                    actionLink: `/tasks/${task._id}`,
                    relatedModel: "Comment",
                    relatedId: comment._id,
                })
                notifications.push(notification)
            }
        }

        // Create due date approaching notifications
        const upcomingTasks = tasks.filter(
            (task) =>
                task.dueDate &&
                task.status !== "done" &&
                task.status !== "archived" &&
                new Date(task.dueDate) > new Date() &&
                new Date(task.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due within a week
        )

        for (const task of upcomingTasks) {
            if (!task.assignees || task.assignees.length === 0) continue

            for (const assigneeId of task.assignees) {
                const notification = await Notification.create({
                    recipient: assigneeId,
                    type: "due-date-approaching",
                    title: "Task Due Soon",
                    description: `Task "${task.title}" is due in ${Math.ceil((new Date(task.dueDate) - new Date()) / (24 * 60 * 60 * 1000))} days`,
                    read: false,
                    priority: "high",
                    actionLink: `/tasks/${task._id}`,
                    relatedModel: "Task",
                    relatedId: task._id,
                })
                notifications.push(notification)
            }
        }

        // Create project update notifications
        for (const project of projects) {
            const projectMembers = users.filter((user) => project.members.includes(user._id))

            for (const member of projectMembers) {
                if (member._id.toString() === project.owner.toString()) continue

                const notification = await Notification.create({
                    recipient: member._id,
                    sender: project.owner,
                    type: "project-update",
                    title: "Project Update",
                    description: `Project "${project.name}" has been updated`,
                    read: Math.random() > 0.6, // 40% chance of being read
                    readAt: Math.random() > 0.6 ? new Date() : undefined,
                    priority: "medium",
                    actionLink: `/projects/${project._id}`,
                    relatedModel: "Project",
                    relatedId: project._id,
                })
                notifications.push(notification)
            }
        }

        logger.info(`Created ${notifications.length} notifications`)
        return notifications
    } catch (error) {
        logger.error(`Error seeding notifications: ${error.message}`)
        throw error
    }
}

/**
 * Seed all data
 * @returns {Promise<Object>} Created data
 */
export const seedAllData = async () => {
    try {
        logger.info("Starting comprehensive data seeding...")

        const users = await seedUsers()
        const teams = await seedTeams(users)
        const projects = await seedProjects(users, teams)
        const sprints = await seedSprints(projects, users)
        const boards = await seedBoards(projects, users)
        const tasks = await seedTasks(projects, users, sprints, boards)
        const comments = await seedComments(tasks, users)
        const timeEntries = await seedTimeEntries(tasks, users)
        const calendarEvents = await seedCalendarEvents(projects, users)
        const attendance = await seedAttendance(users)
        const leaves = await seedLeaves(users)
        const notifications = await seedNotifications(users, tasks, projects)

        logger.info("Comprehensive data seeding completed successfully!")

        return {
            users: users.length,
            teams: teams.length,
            projects: projects.length,
            sprints: sprints.length,
            boards: boards.length,
            tasks: tasks.length,
            comments: comments.length,
            timeEntries: timeEntries.length,
            calendarEvents: calendarEvents.length,
            attendance: attendance.length,
            leaves: leaves.length,
            notifications: notifications.length,
        }
    } catch (error) {
        logger.error(`Error seeding all data: ${error.message}`)
        throw error
    }
}

/**
 * Clear all data (DANGEROUS - use only in development)
 * @returns {Promise<void>}
 */
export const clearAllData = async () => {
    if (process.env.NODE_ENV !== "development") {
        throw new Error("This function can only be used in development environment")
    }

    try {
        logger.warn("Clearing all data from database...")

        // Get all collections
        const collections = mongoose.connection.collections

        // Drop each collection
        for (const key in collections) {
            await collections[key].deleteMany({})
        }

        logger.info("All data cleared successfully")
    } catch (error) {
        logger.error(`Error clearing data: ${error.message}`)
        throw error
    }
}
