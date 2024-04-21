const jwt = require("jsonwebtoken")

// Middleware to authenticate user's JWT token
exports.authenticateUser = async (req, res, next) => {
  try {
    // Check if Authorization header is present
    const token = req.body.token
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // Attach user object to request
    req.userId = decoded.userId
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.render("not-authorized", {
        error: "Unauthorized: Token expired",
      })
    }
    return res.render("not-authorized", {
      error: "Unauthorized: Invalid JWT token",
    })
  }
}
