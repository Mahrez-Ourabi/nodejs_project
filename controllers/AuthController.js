const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const { sendVerificationEmail } = require("../middleware/emailService")

// Function to generate a random 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000)
}

// Register a new user
exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body

    email = email.toLowerCase()

    // Check if the user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.render("register", { error: "User already exists" })
    }

    // Generate verification code
    const verificationCode = generateVerificationCode()

    // Hash the password
    const saltRounds = 10 // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const isadmin = email.endsWith("-admin@gmail.com")
    // Send verification email and create user if successful
    if (!isadmin) {
      await sendVerificationEmail(email, verificationCode)
    }

    await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: isadmin,
      verificationCode,
      isVerified: isadmin,
    }).then(() => res.redirect("/auth/verify-email"))
  } catch (error) {
    res.render("register", { error: "Failed to register user" })
  }
}

// Verify email code
exports.verifyEmailCode = async (req, res) => {
  try {
    let { email, verificationCode } = req.body
    console.log(email, verificationCode)

    email = email.toLowerCase()

    const user = await User.findOne({ email })

    if (!user) {
      res.render("verify-email", { error: "User not found" })
    } else if (user.verificationCode != verificationCode) {
      res.render("verify-email", {
        error: "Invalid verification code",
      })
    } else {
      user.isVerified = true
      user.verificationCode = 0
      await user.save()
      res.redirect("/auth/login")
    }

    // Redirect to login page after successful email verification
  } catch (error) {
    console.error(error)
    res.render("verify-email", { error: "Failed to verify email" })
  }
}

// Login user
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body
    email = email.toLowerCase()
    const user = await User.findOne({ email })

    if (!user) {
      res.render("login", { error: "User not found" })
    } else if (!user.isVerified) {
      res.render("login", { error: "User is not verified" })
    } else {
      if (!(await bcrypt.compare(password, user.password))) {
        res.render("login", { error: "wrong password!" })
      } else {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        })
        res.render("login", { token: token })
      }
    }
  } catch (error) {
    res.render("login", { error: error })
  }
}

// Logout user
exports.logout = (req, res) => {
  try {
    res.clearCookie("token")
    res.redirect("/home") // Redirect to home page after logout
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to logout" })
  }
}
