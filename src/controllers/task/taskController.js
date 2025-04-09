import catchAsync from "../../utils/catchAsync.js"
import AppError from "../../utils/appError.js"
import * as taskService from "../../services/taskService.js"

/**
 * Get all tasks
 */
export const getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await taskService.getAllTasks(req.query)

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: {
      tasks,
    },
  })
})

/**
 * Get a single task
 */
export const getTask = catchAsync(async (req, res, next) => {
  const task = await taskService.getTaskById(req.params.id)

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  })
})

/**
 * Create a new task
 */
export const createTask = catchAsync(async (req, res, next) => {
  // Set the reporter to the current user if not provided
  if (!req.body.reporter) {
    req.body.reporter = req.user.id
  }

  const newTask = await taskService.createTask(req.body)

  res.status(201).json({
    status: "success",
    data: {
      task: newTask,
    },
  })
})

/**
 * Update a task
 */
export const updateTask = catchAsync(async (req, res, next) => {
  const task = await taskService.updateTask(req.params.id, req.body)

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  })
})

/**
 * Delete a task
 */
export const deleteTask = catchAsync(async (req, res, next) => {
  await taskService.deleteTask(req.params.id)

  res.status(204).json({
    status: "success",
    data: null,
  })
})

/**
 * Get tasks by status
 */
export const getTasksByStatus = catchAsync(async (req, res, next) => {
  const tasks = await taskService.getTasksByStatus(req.params.status)

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: {
      tasks,
    },
  })
})

/**
 * Get tasks by assignee
 */
export const getTasksByAssignee = catchAsync(async (req, res, next) => {
  const tasks = await taskService.getTasksByAssignee(req.params.userId)

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: {
      tasks,
    },
  })
})

/**
 * Update task status
 */
export const updateTaskStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body

  if (!status) {
    return next(new AppError("Status is required", 400))
  }

  const task = await taskService.updateTaskStatus(req.params.id, status)

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  })
})

/**
 * Get task comments
 */
export const getTaskComments = catchAsync(async (req, res, next) => {
  const comments = await taskService.getTaskComments(req.params.id)

  res.status(200).json({
    status: "success",
    results: comments.length,
    data: {
      comments,
    },
  })
})

/**
 * Add task comment
 */
export const addTaskComment = catchAsync(async (req, res, next) => {
  const newComment = await taskService.addTaskComment(req.params.id, {
    content: req.body.content,
    user: req.user.id,
    attachments: req.body.attachments || [],
    mentions: req.body.mentions || [],
  })

  res.status(201).json({
    status: "success",
    data: {
      comment: newComment,
    },
  })
})
