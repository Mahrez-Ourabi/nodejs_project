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

// GET a specific reservation
router.get("/:id", ReservastionController.getReservationById)

// POST a new reservation
router.post("/", authenticateUser, ReservastionController.createReservation)

// PUT/update a reservation
router.put("/:id", authenticateUser, ReservastionController.updateReservation)

// DELETE a reservation
router.delete(
  "/:id",
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

module.exports = router
