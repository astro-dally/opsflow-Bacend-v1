/**
 * Catch async errors and pass them to the error handler
 * @param {Function} fn - Async function
 * @returns {Function} Express middleware
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

export default catchAsync
