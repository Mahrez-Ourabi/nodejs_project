const express = require("express")
const authController = require("../controllers/AuthController") // Correct path to the AuthController file

const router = express.Router()

// Route for user registration
router.post("/register", authController.register)

// Route for user login
router.post("/login", authController.login)

// Route for user logout
router.post("/logout", authController.logout)

// Route for email verification
router.post("/verify-email", authController.verifyEmailCode)

// Render the registration page
router.get("/register", (req, res) => {
  res.render("register")
})

// Render the login page
router.get("/login", (req, res) => {
  res.render("login")
})

// Render the email verification page
router.get("/verify-email", (req, res) => {
  res.render("verify-email")
})

module.exports = router
