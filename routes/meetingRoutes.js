const express = require("express")
const meetingController = require("../controllers/MeetingRoomController") // Assuming the controller file is named meetingController.js
const { authenticateUser } = require("../middleware/middleware") // Assuming the middleware file is named middleware.js
const { authAdmin } = require("../middleware/authMiddleware") // Assuming the middleware file is named authMiddleware.js
const router = express.Router()
const MeetingRoom = require("../models/meetingRoom")

// Route to get all meetings
router.get("/", meetingController.getAllMeetingRooms)

// Route to create a new meeting
router.post(
  "/",
  authenticateUser,
  // authAdmin,
  meetingController.createMeetingRoom
)

// Route to update a meeting by ID
router.post(
  "/edit/:id",
  authenticateUser,
  // authAdmin,
  meetingController.updateMeetingRoomById
)

// Route to delete a meeting by ID
router.post(
  "/delete/:id",
  authenticateUser,
  // authAdmin,
  meetingController.deleteMeetingRoomById
)

router.get("/create", (req, res) => {
  res.render("create-room")
})

router.get("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params
    const meetingRoom = await MeetingRoom.findById(id)
    if (!meetingRoom) {
      return res.render("edit-room", { error: "Meeting room not found" })
    }
    res.render("edit-room", { meetingRoom: meetingRoom })
  } catch (error) {
    console.error(error)
    res.render("edit-room", { error: "Failed to fetch meeting room" })
  }
})
// Route to get a specific meeting by ID
router.get("/:id", meetingController.getMeetingRoomById)

module.exports = router
