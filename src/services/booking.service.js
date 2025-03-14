
const {BookingRepository} = require("../respository/index.js");
const {ApiError, enums}= require("../utils/index.js");
const {StatusCodes} = require("http-status-codes");
const axios = require("axios")
const {serverPort}= require("../config/index.js");
const db= require("../models/index.js");

const {BOOKED, CANCELLED} = enums.bookingStatus;

const bookingRepository = new BookingRepository(); 
 
async function createBooking(data){
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${serverPort.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        // console.log(flight);
        const flight_data = flight.data.data;
        if(data.noOfSeats > flight_data.totalSeats){
            throw new ApiError("Seats are not available", StatusCodes.NOT_ACCEPTABLE);
        }
        const bookingCost  = data.noOfSeats * flight_data.price;
        const bookingData = {...data, totalCost : bookingCost };
        const booking = await bookingRepository.create_booking(bookingData, transaction);
        // update totalSeats...
        await axios.patch(`${serverPort.FLIGHT_SERVICE}/api/v1/flights/update-seat/${data.flightId}`, {seats:data.noOfSeats});
        await transaction.commit();
        return booking;
        
    } catch (error) {
        // console.log(error);
        await transaction.rollback(); 
        throw new ApiError("Booking not confirmed", error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function makePayment(data){
      
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get_booking(data.bookingId, transaction);
        if(bookingDetails.status == CANCELLED){
            throw new ApiError("Booking has been cancelled", StatusCodes.BAD_REQUEST); 
        }
        if(bookingDetails.totalCost != data.cost){
            throw new ApiError("Amount is not matching, Try again!", StatusCodes.BAD_REQUEST); 
        }
        if(bookingDetails.userId != data.userId){
            throw new ApiError("UserId id not matching", StatusCodes.BAD_REQUEST); 
        }
        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        if(currentTime-bookingTime > 600000){
            await cancelBooking(data);
            throw new ApiError("Time is up! Booking has expired", StatusCodes.BAD_REQUEST);
        }

        // assuming payment is successfull...
        await bookingRepository.update_booking(data.bookingId, {status:BOOKED}, transaction);
        await transaction.commit();
        return bookingDetails;
    } catch (error) {
        // console.log(error);
        await transaction.rollback();
        throw new ApiError(error.message || "Payment is not completed", error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
   
    }
}

async function cancelBooking(data){
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get_booking(data.bookingId, transaction);
        if(bookingDetails.status == CANCELLED){
            await transaction.commit();
            return true; 
        }
        await axios.patch(`${serverPort.FLIGHT_SERVICE}/api/v1/flights/update-seat/${data.flightId}`, {seats: bookingDetails.noOfSeats, dec: 0});
        await bookingRepository.update_booking(data.bookingId, {status:CANCELLED}, transaction);
        await transaction.commit();
        return true;

    } catch (error) {
        console.log(error);
        
        await transaction.rollback();
        throw new ApiError(error.message || "Booking has not been cancelled", error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
     }

}

// No need to call api for this....
async function cancelOldBookings(){
    try {

        let time = new Date(Date.now() + 1000*5*60);
        const resp = await bookingRepository.update_oldBooking(time);
        return resp;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports={
    createBooking,
    makePayment,
    cancelBooking,
    cancelOldBookings
}