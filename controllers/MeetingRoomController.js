const MeetingRoom = require("../models/meetingRoom")

// Get all meeting rooms
exports.getAllMeetingRooms = async (req, res) => {
  try {
    const meetingRooms = await MeetingRoom.find()
    res.render("rooms", { meetingRooms: meetingRooms })
  } catch (error) {
    console.error(error)
    res.render("rooms", { error: "Failed to fetch meeting rooms" })
  }
}

// Create a new meeting room
exports.createMeetingRoom = async (req, res) => {
  try {
    const { name, capacity, equipment } = req.body
    //check if room already exists
    const existingRoom = await MeetingRoom.findOne({ name })

    if (existingRoom) {
      return res.render("create-room", { error: "Room already exists" })
    }

    const meetingRoom = new MeetingRoom({ name, capacity, equipment })
    await meetingRoom.save()
    res.redirect("/meeting-room/all")
  } catch (error) {
    console.error(error)
    res.render("create-room", { error: "Failed to create meeting room" })
  }
}

// Get a single meeting room by ID
exports.getMeetingRoomById = async (req, res) => {
  try {
    const { id } = req.params
    const meetingRoom = await MeetingRoom.findById(id)
    if (!meetingRoom) {
      return res.render("meeting-room", { error: "Meeting room not found" })
    }
    res.render("meeting-room", { meetingRoom: meetingRoom })
  } catch (error) {
    console.error(error)
    res.render("meeting-room", { error: "Failed to fetch meeting room" })
  }
}

// Update a meeting room by ID
exports.updateMeetingRoomById = async (req, res) => {
  try {
    const { id } = req.params
    const { name, capacity } = req.body
    const updatedMeetingRoom = await MeetingRoom.findByIdAndUpdate(
      id,
      { name, capacity },
      { new: true }
    )
    if (!updatedMeetingRoom) {
      return res.render("edit-room", { error: "Meeting room not found" })
    }
    res.redirect("/meeting-room/all")
  } catch (error) {
    console.error(error)
    res.render("edit-room", { error: "Failed to update meeting room" })
  }
}

// Delete a meeting room by ID
exports.deleteMeetingRoomById = async (req, res) => {
  try {
    const { id } = req.params
    const deletedMeetingRoom = await MeetingRoom.findByIdAndDelete(id)
    if (!deletedMeetingRoom) {
      return res.render("all-rooms", { error: "Meeting room not found" })
    }
    res.redirect("/meeting-room/all")
  } catch (error) {
    console.error(error)
    res.render("all-rooms", { error: "Failed to delete meeting room" })
  }
}
