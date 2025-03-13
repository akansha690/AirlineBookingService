const express = require('express');
const router=express.Router();

const bookingRoutes = require("./booking.route.js");

router.use('/bookings', bookingRoutes);

module.exports = router;