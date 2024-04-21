const jwt = require("jsonwebtoken")

// Middleware to authenticate user's JWT token
exports.authenticateUser = async (req, res, next) => {
  try {
    // Check if Authorization header is present
    const token = req.body.token

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("Decoded:", decoded)
    // Attach user object to request
    req.userId = decoded.userId
    console.log("User ID:", req.userId)
    next()
  } catch (error) {
    console.error("Authentication error:", error.message)
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token expired" })
    }
    return res.status(401).json({ error: "Unauthorized: Invalid JWT token" })
  }
}
