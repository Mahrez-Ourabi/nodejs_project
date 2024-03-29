// authMiddleware.js

// Assuming you have a user object with a property called 'isAdmin'
function authMiddleware(req, res, next) {
    // Check if the user is an admin
    if (req.user && req.user.isAdmin) {
        // User is an admin, proceed to the next middleware or route handler
        next();
    } else {
        // User is not an admin, send a 403 Forbidden response
        res.status(403).json({ error: 'Unauthorized-admin' });
    }
}

module.exports = authMiddleware;