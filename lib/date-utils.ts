import {
  format,
  formatDistance,
  differenceInDays,
  addDays,
  isToday,
  isPast,
  isFuture,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns"

/**
 * Standard date formats used throughout the application
 */
export const DATE_FORMATS = {
  // Display formats
  SHORT_DATE: "MMM d, yyyy", // Jan 1, 2023
  MEDIUM_DATE: "MMMM d, yyyy", // January 1, 2023
  LONG_DATE: "EEEE, MMMM d, yyyy", // Monday, January 1, 2023
  SHORT_DATE_TIME: "MMM d, yyyy h:mm a", // Jan 1, 2023 2:30 PM
  MEDIUM_DATE_TIME: "MMMM d, yyyy h:mm a", // January 1, 2023 2:30 PM
  TIME_ONLY: "h:mm a", // 2:30 PM
  TIME_WITH_SECONDS: "h:mm:ss a", // 2:30:45 PM

  // Input formats
  INPUT_DATE: "yyyy-MM-dd", // 2023-01-01 (for date inputs)
  INPUT_TIME: "HH:mm", // 14:30 (for time inputs)
  INPUT_DATE_TIME: "yyyy-MM-dd'T'HH:mm", // 2023-01-01T14:30 (for datetime-local inputs)

  // API formats
  ISO_DATE: "yyyy-MM-dd", // 2023-01-01
  ISO_DATE_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", // 2023-01-01T14:30:00.000Z
}

/**
 * Format a date using a standard format
 */
export function formatDate(date: Date | string | number, formatString = DATE_FORMATS.SHORT_DATE): string {
  if (!date) return ""

  try {
    const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
    return format(dateObj, formatString)
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid date"
  }
}

/**
 * Format a date and time
 */
export function formatDateTime(date: Date | string | number, formatString = DATE_FORMATS.SHORT_DATE_TIME): string {
  return formatDate(date, formatString)
}

/**
 * Format just the time portion of a date
 */
export function formatTime(date: Date | string | number, formatString = DATE_FORMATS.TIME_ONLY): string {
  return formatDate(date, formatString)
}

/**
 * Format a duration in seconds to a readable format (HH:MM:SS)
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

/**
 * Format a duration in minutes to a readable format (Xh Ym)
 */
export function formatDurationFromMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) {
    return `${mins}m`
  } else if (mins === 0) {
    return `${hours}h`
  } else {
    return `${hours}h ${mins}m`
  }
}

/**
 * Get a relative time string (e.g., "2 days ago", "in 3 hours")
 */
export function getRelativeTimeString(date: Date | string | number): string {
  if (!date) return ""

  try {
    const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
    return formatDistance(dateObj, new Date(), { addSuffix: true })
  } catch (error) {
    console.error("Error formatting relative date:", error)
    return "Invalid date"
  }
}

/**
 * Get a human-readable string for remaining days
 */
export function getRemainingDaysString(dueDate: Date | string | number): string {
  if (!dueDate) return ""

  try {
    const dateObj = typeof dueDate === "string" || typeof dueDate === "number" ? new Date(dueDate) : dueDate
    const now = new Date()
    const diffDays = differenceInDays(dateObj, now)

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""}`
    } else if (diffDays === 0) {
      return "Due today"
    } else if (diffDays === 1) {
      return "Due tomorrow"
    } else {
      return `Due in ${diffDays} days`
    }
  } catch (error) {
    console.error("Error calculating remaining days:", error)
    return "Invalid date"
  }
}

/**
 * Parse a date string to a Date object
 */
export function parseDate(dateString: string): Date {
  if (!dateString) return new Date()

  try {
    return new Date(dateString)
  } catch (error) {
    console.error("Error parsing date:", error)
    return new Date()
  }
}

/**
 * Check if a date is today
 */
export function isDateToday(date: Date | string | number): boolean {
  if (!date) return false

  try {
    const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
    return isToday(dateObj)
  } catch (error) {
    console.error("Error checking if date is today:", error)
    return false
  }
}

/**
 * Check if a date is in the past
 */
export function isDatePast(date: Date | string | number): boolean {
  if (!date) return false

  try {
    const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
    return isPast(dateObj)
  } catch (error) {
    console.error("Error checking if date is in the past:", error)
    return false
  }
}

/**
 * Check if a date is in the future
 */
export function isDateFuture(date: Date | string | number): boolean {
  if (!date) return false

  try {
    const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
    return isFuture(dateObj)
  } catch (error) {
    console.error("Error checking if date is in the future:", error)
    return false
  }
}

/**
 * Get date range for this week
 */
export function getThisWeekRange(): { from: Date; to: Date } {
  const now = new Date()
  return {
    from: startOfWeek(now, { weekStartsOn: 1 }), // Start week on Monday
    to: endOfWeek(now, { weekStartsOn: 1 }),
  }
}

/**
 * Get date range for this month
 */
export function getThisMonthRange(): { from: Date; to: Date } {
  const now = new Date()
  return {
    from: startOfMonth(now),
    to: endOfMonth(now),
  }
}

/**
 * Get date range for last 7 days
 */
export function getLast7DaysRange(): { from: Date; to: Date } {
  const now = new Date()
  return {
    from: addDays(now, -6), // 6 days ago + today = 7 days
    to: now,
  }
}

/**
 * Get date range for last 30 days
 */
export function getLast30DaysRange(): { from: Date; to: Date } {
  const now = new Date()
  return {
    from: addDays(now, -29), // 29 days ago + today = 30 days
    to: now,
  }
}

/**
 * Check if a date is within a date range
 */
export function isDateInRange(date: Date | string | number, range: { from: Date; to: Date }): boolean {
  if (!date || !range.from || !range.to) return false

  try {
    const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
    return isWithinInterval(dateObj, { start: range.from, end: range.to })
  } catch (error) {
    console.error("Error checking if date is in range:", error)
    return false
  }
}
