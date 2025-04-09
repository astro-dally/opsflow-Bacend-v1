import Task from "../models/Task.js"
import Comment from "../models/Comment.js"
import AppError from "../utils/appError.js"

/**
 * Get all tasks with filtering, sorting, and pagination
 */
export const getAllTasks = async (queryParams) => {
  // Build query
  const queryObj = { ...queryParams }
  const excludedFields = ["page", "sort", "limit", "fields"]
  excludedFields.forEach((el) => delete queryObj[el])

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

  // Execute query
  let query = Task.find(JSON.parse(queryStr))

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
 * Get a single task by ID
 */
export const getTaskById = async (id) => {
  const task = await Task.findById(id)
    .populate("project", "name")
    .populate("reporter", "name email")
    .populate("assignees", "name email avatar")

  if (!task) {
    throw new AppError("No task found with that ID", 404)
  }

  return task
}

/**
 * Create a new task
 */
export const createTask = async (taskData) => {
  return await Task.create(taskData)
}

/**
 * Update a task
 */
export const updateTask = async (id, updateData) => {
  const task = await Task.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })

  if (!task) {
    throw new AppError("No task found with that ID", 404)
  }

  return task
}

/**
 * Delete a task
 */
export const deleteTask = async (id) => {
  const task = await Task.findByIdAndDelete(id)

  if (!task) {
    throw new AppError("No task found with that ID", 404)
  }

  return task
}

/**
 * Get tasks by status
 */
export const getTasksByStatus = async (status) => {
  return await Task.find({ status })
}

/**
 * Get tasks by assignee
 */
export const getTasksByAssignee = async (userId) => {
  return await Task.find({ assignees: userId })
}

/**
 * Update task status
 */
export const updateTaskStatus = async (id, status) => {
  const task = await Task.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true,
    },
  )

  if (!task) {
    throw new AppError("No task found with that ID", 404)
  }

  return task
}

/**
 * Get task comments
 */
export const getTaskComments = async (taskId) => {
  return await Comment.find({ task: taskId }).populate("user", "name email avatar").sort("-createdAt")
}

/**
 * Add task comment
 */
export const addTaskComment = async (taskId, commentData) => {
  // Check if task exists
  const task = await Task.findById(taskId)
  if (!task) {
    throw new AppError("No task found with that ID", 404)
  }

  // Create comment
  return await Comment.create({
    ...commentData,
    task: taskId,
  })
}
