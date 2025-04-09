import TimeEntry from "../../models/TimeEntry.js"
import catchAsync from "../../utils/catchAsync.js"
import AppError from "../../utils/appError.js"

/**
 * Get all time entries
 */
export const getAllTimeEntries = catchAsync(async (req, res, next) => {
  const timeEntries = await TimeEntry.find()
    .populate("user", "name email")
    .populate("project", "name")
    .populate("task", "title")

  res.status(200).json({
    status: "success",
    results: timeEntries.length,
    data: {
      timeEntries,
    },
  })
})

/**
 * Get a single time entry
 */
export const getTimeEntry = catchAsync(async (req, res, next) => {
  const timeEntry = await TimeEntry.findById(req.params.id)
    .populate("user", "name email")
    .populate("project", "name")
    .populate("task", "title")

  if (!timeEntry) {
    return next(new AppError("No time entry found with that ID", 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      timeEntry,
    },
  })
})

/**
 * Create a new time entry
 */
export const createTimeEntry = catchAsync(async (req, res, next) => {
  // Set the user to the current user if not provided
  if (!req.body.user) {
    req.body.user = req.user.id
  }

  const newTimeEntry = await TimeEntry.create(req.body)

  res.status(201).json({
    status: "success",
    data: {
      timeEntry: newTimeEntry,
    },
  })
})

/**
 * Update a time entry
 */
export const updateTimeEntry = catchAsync(async (req, res, next) => {
  const timeEntry = await TimeEntry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!timeEntry) {
    return next(new AppError("No time entry found with that ID", 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      timeEntry,
    },
  })
})

/**
 * Delete a time entry
 */
export const deleteTimeEntry = catchAsync(async (req, res, next) => {
  const timeEntry = await TimeEntry.findByIdAndDelete(req.params.id)

  if (!timeEntry) {
    return next(new AppError("No time entry found with that ID", 404))
  }

  res.status(204).json({
    status: "success",
    data: null,
  })
})

/**
 * Start timer
 */
export const startTimer = catchAsync(async (req, res, next) => {
  // Check if user has any running timers
  const runningTimer = await TimeEntry.findOne({
    user: req.user.id,
    isRunning: true,
  })

  if (runningTimer) {
    return next(new AppError("You already have a running timer", 400))
  }

  // Create new timer
  const newTimer = await TimeEntry.create({
    user: req.user.id,
    project: req.body.project,
    task: req.body.task,
    description: req.body.description,
    startTime: new Date(),
    isRunning: true,
    source: "timer",
  })

  res.status(201).json({
    status: "success",
    data: {
      timeEntry: newTimer,
    },
  })
})

/**
 * Stop timer
 */
export const stopTimer = catchAsync(async (req, res, next) => {
  const timeEntry = await TimeEntry.findById(req.params.id)

  if (!timeEntry) {
    return next(new AppError("No time entry found with that ID", 404))
  }

  if (!timeEntry.isRunning) {
    return next(new AppError("This timer is not running", 400))
  }

  // Update timer
  timeEntry.endTime = new Date()
  timeEntry.isRunning = false
  await timeEntry.save()

  res.status(200).json({
    status: "success",
    data: {
      timeEntry,
    },
  })
})

/**
 * Get my time entries
 */
export const getMyTimeEntries = catchAsync(async (req, res, next) => {
  const timeEntries = await TimeEntry.find({ user: req.user.id })
    .populate("project", "name")
    .populate("task", "title")
    .sort("-startTime")

  res.status(200).json({
    status: "success",
    results: timeEntries.length,
    data: {
      timeEntries,
    },
  })
})

/**
 * Get time entries by project
 */
export const getTimeEntriesByProject = catchAsync(async (req, res, next) => {
  const timeEntries = await TimeEntry.find({ project: req.params.projectId })
    .populate("user", "name email")
    .populate("task", "title")
    .sort("-startTime")

  res.status(200).json({
    status: "success",
    results: timeEntries.length,
    data: {
      timeEntries,
    },
  })
})

/**
 * Get time entries by task
 */
export const getTimeEntriesByTask = catchAsync(async (req, res, next) => {
  const timeEntries = await TimeEntry.find({ task: req.params.taskId })
    .populate("user", "name email")
    .populate("project", "name")
    .sort("-startTime")

  res.status(200).json({
    status: "success",
    results: timeEntries.length,
    data: {
      timeEntries,
    },
  })
})

/**
 * Get time statistics
 */
export const getTimeStats = catchAsync(async (req, res, next) => {
  const stats = await TimeEntry.aggregate([
    {
      $match: {
        user: req.user._id,
        startTime: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$startTime" },
        },
        totalDuration: { $sum: "$duration" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  })
})
