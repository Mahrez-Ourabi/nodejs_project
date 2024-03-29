const express = require('express');
const dotenv  = require('dotenv');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const meetingRoomRoutes = require('./routes/meetingRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

dotenv.config();
// Middleware
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;
const URI = process.env.URI;




// Routes
app.use('/auth', authRoutes);
app.use('/meeting-room', meetingRoomRoutes);
app.use('/reservation', reservationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
mongoose
  .connect(URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

