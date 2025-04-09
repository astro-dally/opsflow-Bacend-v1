import User from "../../models/User.js"
import catchAsync from "../../utils/catchAsync.js"
import AppError from "../../utils/appError.js"

/**
 * Get all users
 */
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  })
})

/**
 * Get a single user
 */
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new AppError("No user found with that ID", 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  })
})

/**
 * Create a new user
 */
export const createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body)

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  })
})

/**
 * Update a user
 */
export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!user) {
    return next(new AppError("No user found with that ID", 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  })
})

/**
 * Delete a user
 */
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)

  if (!user) {
    return next(new AppError("No user found with that ID", 404))
  }

  res.status(204).json({
    status: "success",
    data: null,
  })
})

/**
 * Get user statistics
 */
export const getUserStats = catchAsync(async (req, res, next) => {
  const stats = await User.aggregate([
    {
      $match: { active: { $ne: false } },
    },
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ])

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  })
})
