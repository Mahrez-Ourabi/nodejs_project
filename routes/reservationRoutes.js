const express = require("express")
const ReservastionController = require("../controllers/ReservationController")
const { authenticateUser } = require("../middleware/middleware")

const router = express.Router()

// GET all reservations
router.get("/", ReservastionController.getAllReservations)

router.get(
  "/user/:id",
  authenticateUser,
  ReservastionController.getUserReservations
)

// POST a new reservation
router.post("/", authenticateUser, ReservastionController.createReservation)

// PUT/update a reservation
router.post(
  "/edit/:id",
  authenticateUser,
  ReservastionController.updateReservation
)

// DELETE a reservation
router.post(
  "/delete/:id",
  authenticateUser,
  ReservastionController.deleteReservation
)

router.get(
  "/confirm-reservation/:reservationId/:token",
  ReservastionController.confirmReservation
)

router.get(
  "/cancel-reservation/:reservationId",
  ReservastionController.cancelReservation
)

router.get("/room/:id", (req, res) => {
  res.render("create-reservation", { meetingRoomId: req.params.id })
})

// GET a specific reservation
router.get("/:id", ReservastionController.getReservationById)

module.exports = router
