/**
 * Get user permissions
 * @param {Object} user - User object
 * @returns {Object} Permission object with can() method
 */
export const getPermissions = async (user) => {
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

            // For now, allow all actions for simplicity
            return true
        },
    }
}

/**
 * Load resource middleware factory
 * @param {string} model - Model name ('Project', 'Task', etc.)
 * @param {string} paramName - URL parameter name for ID
 * @returns {Function} Middleware function
 */
export const loadResource = (model, paramName = "id") => {
    return async (req, res, next) => {
        // For now, just pass through
        next()
    }
}
