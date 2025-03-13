const CrudRepository = require("./crud.repository");
const {Booking}= require("../models/index.js");

class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking);
    }
    async create_booking(data, transaction){
        const response = await Booking.create(data, {transaction : transaction});
        return response;
    }

    async get_booking(data, transaction){
        const response = await Booking.findByPk(data, {transaction:transaction});
        return response;
    }
    async update_booking(id, data, transaction){
        const [response] = await Booking.update(data, {where:{id:id}}, {transaction:transaction});
        return response;
    }
}

module.exports= BookingRepository