const express = require('express');
const meetingController = require('../controllers/MeetingRoomController'); // Assuming the controller file is named meetingController.js
const {authenticateUser} = require('../middleware/middleware'); // Assuming the middleware file is named middleware.js
const {authAdmin} = require('../middleware/authMiddleware'); // Assuming the middleware file is named authMiddleware.js
const router = express.Router();

// Route to get all meetings
router.get('/', meetingController.getAllMeetingRooms);

// Route to get a specific meeting by ID
router.get('/:id', meetingController.getMeetingRoomById);

// Route to create a new meeting
router.post('/', authenticateUser, authAdmin , meetingController.createMeetingRoom);

// Route to update a meeting by ID
router.put('/:id',authenticateUser, authAdmin, meetingController.updateMeetingRoomById);

// Route to delete a meeting by ID
router.delete('/:id',authenticateUser, authAdmin, meetingController.deleteMeetingRoomById);

module.exports = router;
