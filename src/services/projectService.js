import Project from "../models/Project.js"
import Task from "../models/Task.js"
import User from "../models/User.js"
import AppError from "../utils/appError.js"

/**
 * Get all projects with filtering, sorting, and pagination
 */
export const getAllProjects = async (queryParams) => {
  // Build query
  const queryObj = { ...queryParams }
  const excludedFields = ["page", "sort", "limit", "fields"]
  excludedFields.forEach((el) => delete queryObj[el])

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

  // Execute query
  let query = Project.find(JSON.parse(queryStr))

  // Sorting
  if (queryParams.sort) {
    const sortBy = queryParams.sort.split(",").join(" ")
    query = query.sort(sortBy)
  } else {
    query = query.sort("-createdAt")
  }

  // Field limiting
  if (queryParams.fields) {
    const fields = queryParams.fields.split(",").join(" ")
    query = query.select(fields)
  } else {
    query = query.select("-__v")
  }

  // Pagination
  const page = Number.parseInt(queryParams.page, 10) || 1
  const limit = Number.parseInt(queryParams.limit, 10) || 10
  const skip = (page - 1) * limit

  query = query.skip(skip).limit(limit)

  // Execute query
  return await query
}

/**
 * Get a single project by ID
 */
export const getProjectById = async (id) => {
  const project = await Project.findById(id)

  if (!project) {
    throw new AppError("No project found with that ID", 404)
  }

  return project
}

/**
 * Create a new project
 */
export const createProject = async (projectData) => {
  return await Project.create(projectData)
}

/**
 * Update a project
 */
export const updateProject = async (id, updateData) => {
  const project = await Project.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })

  if (!project) {
    throw new AppError("No project found with that ID", 404)
  }

  return project
}

/**
 * Delete a project
 */
export const deleteProject = async (id) => {
  const project = await Project.findByIdAndDelete(id)

  if (!project) {
    throw new AppError("No project found with that ID", 404)
  }

  return project
}

/**
 * Get project statistics
 */
export const getProjectStats = async () => {
  return await Project.aggregate([
    {
      $match: { isArchived: { $ne: true } },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        avgProgress: { $avg: "$progress" },
      },
    },
    {
      $sort: { count: -1 },
    },
  ])
}

/**
 * Get project tasks
 */
export const getProjectTasks = async (projectId) => {
  return await Task.find({ project: projectId })
}

/**
 * Get project members
 */
export const getProjectMembers = async (projectId) => {
  const project = await Project.findById(projectId)

  if (!project) {
    throw new AppError("No project found with that ID", 404)
  }

  return await User.find({ _id: { $in: project.members } })
}

/**
 * Add project member
 */
export const addProjectMember = async (projectId, userId) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new AppError("No user found with that ID", 404)
  }

  const project = await Project.findById(projectId)
  if (!project) {
    throw new AppError("No project found with that ID", 404)
  }

  // Check if user is already a member
  if (project.members.includes(userId)) {
    throw new AppError("User is already a member of this project", 400)
  }

  // Add user to project members
  project.members.push(userId)
  await project.save()

  return project
}

/**
 * Remove project member
 */
export const removeProjectMember = async (projectId, userId) => {
  const project = await Project.findById(projectId)
  if (!project) {
    throw new AppError("No project found with that ID", 404)
  }

  // Check if user is a member
  if (!project.members.includes(userId)) {
    throw new AppError("User is not a member of this project", 400)
  }

  // Remove user from project members
  project.members = project.members.filter((member) => member.toString() !== userId)
  await project.save()

  return project
}
