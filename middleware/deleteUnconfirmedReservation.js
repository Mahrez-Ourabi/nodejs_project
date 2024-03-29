// deleteUnconfirmedReservation.js

const Reservation = require('../models/reservation');

const deleteUnconfirmedReservation = async (reservationId) => {
    try {
        const reservation = await Reservation.findById(reservationId);
        if (reservation && !reservation.confirmed) {
            await Reservation.findByIdAndDelete(reservationId);
            console.log('Unconfirmed reservation deleted after 10 minutes:', reservationId);
        }
    } catch (error) {
        console.error('Error deleting unconfirmed reservation:', error);
    }
};

module.exports = deleteUnconfirmedReservation;
