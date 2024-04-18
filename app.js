const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors") // Import cors middleware
const morgan = require("morgan") // Import morgan middleware for logging
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const authRoutes = require("./routes/authRoutes")
const meetingRoomRoutes = require("./routes/meetingRoutes")
const reservationRoutes = require("./routes/reservationRoutes")
const { authenticateUser } = require("./middleware/middleware")

dotenv.config()

const app = express()

// Middleware
app.use(cors()) // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan("tiny"))
app.use(bodyParser.json())
app.use(express.static("public"))

// Set up EJS as the view engine
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")

app.get("/", (req, res) => {
  // Render the home page view
  res.render("home")
})

// Routes
app.use("/auth", authRoutes)
app.use("/meeting-room", meetingRoomRoutes)
app.use("/reservation", reservationRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something went wrong!")
})

// Start the server
const PORT = process.env.PORT || 3000
const URI = process.env.URI

mongoose
  .connect(URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`)
    })
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err.message)
  })
