// authMiddleware.js
const User = require("../models/user")

// Assuming you have a user object with a property called 'isAdmin'
const authAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)

    // Check if the user is an admin
    if (user && user.isAdmin) {
      // User is an admin, proceed to the next middleware or route handler
      next()
    } else {
      // User is not an admin, send a 403 Forbidden response
      res.status(403).json({ error: "Unauthorized-admin" })
    }
  } catch (error) {
    console.error("Error in authMiddleware:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = { authAdmin }
