const express = require('express');
const router=express.Router();

const {bookingController}=require("../../controllers/index.js")

router.post('/payment', bookingController.makePayment);  
router.patch('/cancel', bookingController.cancelBooking);  
router.post('/:id', bookingController.createBooking);  


module.exports = router;