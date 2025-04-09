import catchAsync from "../../utils/catchAsync.js"
import * as projectService from "../../services/projectService.js"
import AppError from "../../utils/appError.js"

/**
 * Get all projects
 */
export const getAllProjects = catchAsync(async (req, res, next) => {
  const projects = await projectService.getAllProjects(req.query)

  res.status(200).json({
    status: "success",
    results: projects.length,
    data: {
      projects,
    },
  })
})

/**
 * Get a single project
 */
export const getProject = catchAsync(async (req, res, next) => {
  const project = await projectService.getProjectById(req.params.id)

  res.status(200).json({
    status: "success",
    data: {
      project,
    },
  })
})

/**
 * Create a new project
 */
export const createProject = catchAsync(async (req, res, next) => {
  // Set the owner to the current user if not provided
  if (!req.body.owner) {
    req.body.owner = req.user.id
  }

  const newProject = await projectService.createProject(req.body)

  res.status(201).json({
    status: "success",
    data: {
      project: newProject,
    },
  })
})

/**
 * Update a project
 */
export const updateProject = catchAsync(async (req, res, next) => {
  const project = await projectService.updateProject(req.params.id, req.body)

  res.status(200).json({
    status: "success",
    data: {
      project,
    },
  })
})

/**
 * Delete a project
 */
export const deleteProject = catchAsync(async (req, res, next) => {
  await projectService.deleteProject(req.params.id)

  res.status(204).json({
    status: "success",
    data: null,
  })
})

/**
 * Get project statistics
 */
export const getProjectStats = catchAsync(async (req, res, next) => {
  const stats = await projectService.getProjectStats()

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  })
})

/**
 * Get project tasks
 */
export const getProjectTasks = catchAsync(async (req, res, next) => {
  const tasks = await projectService.getProjectTasks(req.params.id)

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: {
      tasks,
    },
  })
})

/**
 * Get project members
 */
export const getProjectMembers = catchAsync(async (req, res, next) => {
  const members = await projectService.getProjectMembers(req.params.id)

  res.status(200).json({
    status: "success",
    results: members.length,
    data: {
      members,
    },
  })
})

/**
 * Add project member
 */
export const addProjectMember = catchAsync(async (req, res, next) => {
  const { userId } = req.body

  if (!userId) {
    return next(new AppError("User ID is required", 400))
  }

  const project = await projectService.addProjectMember(req.params.id, userId)

  res.status(200).json({
    status: "success",
    data: {
      project,
    },
  })
})

/**
 * Remove project member
 */
export const removeProjectMember = catchAsync(async (req, res, next) => {
  const project = await projectService.removeProjectMember(req.params.id, req.params.userId)

  res.status(200).json({
    status: "success",
    data: {
      project,
    },
  })
})
