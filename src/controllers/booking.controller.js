const {bookingService}=require("../services/index.js");
const {successResponse, errorResponse} = require("../utils/index.js");
const {StatusCodes} = require("http-status-codes");

async function createBooking(req, res){
    try {
        const resp = await bookingService.createBooking({
            flightId: req.params.id,
            userId:req.body.userId,
            noOfSeats: req.body.noOfSeats,
            status:req.body.status
        })
        successResponse.data = resp;
        successResponse.message="Booking created successfully";
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (error) {
        // console.log(error);
        
        errorResponse.error=error;
        errorResponse.message="Booking not done";
        return res.status(error.statusCode).json(errorResponse);
    }    
}

async function makePayment(req, res){
    try {
        const data = {
            bookingId: req.body.bookingId,
            cost : req.body.cost,
            userId: req.body.userId
        }
        const response = await bookingService.makePayment(data);
        successResponse.data = response;
        successResponse.message="Payment done successfully";
        return res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {        
        errorResponse.error=error;
        errorResponse.message="Payment not done";
        return res.status(error.statusCode).json(errorResponse);
    }
}

module.exports={
    createBooking,
    makePayment
}