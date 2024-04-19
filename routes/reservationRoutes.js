const express = require("express")
const ReservastionController = require("../controllers/ReservationController")
const { authenticateUser } = require("../middleware/middleware")

const router = express.Router()

// GET all reservations
router.get("/", ReservastionController.getAllReservations)

router.get(
  "/reservations-user",
  authenticateUser,
  ReservastionController.getUserReservations
)

// GET a specific reservation
router.get("/:id", ReservastionController.getReservationById)

// POST a new reservation
router.post("/", authenticateUser, ReservastionController.createReservation)

// PUT/update a reservation
router.put("/:id", ReservastionController.updateReservation)

// DELETE a reservation
router.delete("/:id", ReservastionController.deleteReservation)

router.get(
  "/confirm-reservation/:reservationId/:token",
  ReservastionController.confirmReservation
)

module.exports = router
