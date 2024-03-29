const Reservation = require('../models/reservation');
const { sendConfirmationEmail } = require('../middleware/emailService');
const deleteUnconfirmedReservation = require('../middleware/deleteUnconfirmedReservation');


// Function to create a reservation
exports.createReservation = async (req, res) => {
  try {
    const { meetingRoomId, startTime, endTime } = req.body;
    const userId = req.userId;

    // Check if the meeting room is available for the specified time
    const conflicts = await Reservation.find({
      meetingRoom: meetingRoomId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Overlapping reservations
        { startTime: { $gte: startTime, $lt: endTime } }, // Reservation starts during an existing reservation
        { endTime: { $gt: startTime, $lte: endTime } }, // Reservation ends during an existing reservation
        { confirmed: true }, // Check if the reservation is confirmed
      ]
    });

    if (conflicts.length > 0) {
      // Check if there's an unconfirmed reservation
      const unconfirmedReservation = conflicts.find(reservation => !reservation.confirmed);
      if (unconfirmedReservation) {
        // Notify the user that the room is reserved but not confirmed yet
        return res.status(409).json({ 
          error: 'Conflicting reservation: Meeting room is already reserved but not confirmed yet. Please wait for 24 hours for any changes.' 
        });
      } else {
        return res.status(409).json({ 
          error: 'Conflicting reservation: Meeting room is already reserved for the specified time' 
        });
      }
    }

    const reservation = await Reservation.create({
      user: userId,
      meetingRoom: meetingRoomId,
      startTime,
      endTime,
      confirmationToken: generateToken() // Generate confirmation token

    });

    // Send confirmation email
    await sendConfirmationEmail(userId, reservation._id, reservation.confirmationToken);


    // If the reservation is not confirmed, schedule deletion after 10 minutes
    if (!reservation.confirmed) {
        setTimeout(() => {
            deleteUnconfirmedReservation(reservation._id);
        }, 10 * 60 * 1000); // 10 minutes in milliseconds
    }


    res.status(201).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};


exports.confirmReservation = async (req, res) => {
    try {
        const { reservationId, token } = req.params;
        
        // Validate token and update reservation status
        // This step is crucial to ensure that the token is valid and belongs to the correct reservation
        // If the token is valid, update the reservation's confirmed attribute to true
        
        // Example code for updating reservation status:
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        
        if (reservation.confirmationToken === token) {
            reservation.confirmed = true;
            await reservation.save();
            return res.redirect('/confirmation-success'); // Redirect to confirmation success page
        } else {
            return res.status(400).json({ error: 'Invalid token' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to confirm reservation' });
    }
};






// Function to get reservations for a specific user
exports.getUserReservations = async (req, res) => {
  try {
    const userId = req.params.userId;
    const reservations = await Reservation.find({ user: userId }).populate('meetingRoom');
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user reservations' });
  }
};

// Function to get all reservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('user').populate('meetingRoom');
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

// Function to get a single reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;
    const reservation = await Reservation.findById(reservationId).populate('user').populate('meetingRoom');
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reservation' });
  }
};

// Function to update a reservation
exports.updateReservation = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;
    const { userId, meetingRoomId, startTime, endTime } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      {
        user: userId,
        meetingRoom: meetingRoomId,
        startTime,
        endTime
      },
      { new: true }
    );
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
};

// Function to delete a reservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;
    const reservation = await Reservation.findByIdAndDelete(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
};
