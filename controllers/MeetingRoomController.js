const MeetingRoom = require('../models/meetingRoom');

// Get all meeting rooms
exports.getAllMeetingRooms = async (req, res) => {
  try {
    const meetingRooms = await MeetingRoom.find();
    res.status(200).json(meetingRooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch meeting rooms' });
  }
};

// Create a new meeting room

exports.createMeetingRoom = async (req, res) => {
  try {
    const { name, capacity , equipment } = req.body;
    //check if room already exists
    const existingRoom = await MeetingRoom.findOne({name});
    
    if (existingRoom) {
      return res.status(409).json({ error: 'Room already exists' });
    }

    
    const meetingRoom = new MeetingRoom({ name, capacity, equipment });
    await meetingRoom.save();
    res.status(201).json(meetingRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create meeting room' });
  }
};

// Get a single meeting room by ID
exports.getMeetingRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const meetingRoom = await MeetingRoom.findById(id);
    if (!meetingRoom) {
      return res.status(404).json({ error: 'Meeting room not found' });
    }
    res.status(200).json(meetingRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch meeting room' });
  }
};

// Update a meeting room by ID
exports.updateMeetingRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity } = req.body;
    const updatedMeetingRoom = await MeetingRoom.findByIdAndUpdate(
      id,
      { name, capacity },
      { new: true }
    );
    if (!updatedMeetingRoom) {
      return res.status(404).json({ error: 'Meeting room not found' });
    }
    res.status(200).json(updatedMeetingRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update meeting room' });
  }
};

// Delete a meeting room by ID
exports.deleteMeetingRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMeetingRoom = await MeetingRoom.findByIdAndDelete(id);
    if (!deletedMeetingRoom) {
      return res.status(404).json({ error: 'Meeting room not found' });
    }
    res.status(200).json({ message: 'Meeting room deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete meeting room' });
  }
};
