const CrudRepository = require("./crud.repository");
const {Booking}= require("../models/index.js");
const { Op } = require("sequelize");
const {enums}=require("../utils/index.js");
const {BOOKED, CANCELLED} = enums.bookingStatus;

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

    async update_oldBooking(timestamp){
        const response = await Booking.update({status: CANCELLED}, {
            where:{
                [Op.and] : [
                    {
                        createdAt:{
                            [Op.lt] : timestamp
                        }
                    },
                    {
                        status:{
                            [Op.ne] : BOOKED
                        }
                    },
                    {
                        status:{
                            [Op.ne] : CANCELLED
                        }
                    }
                ]
            }
        })
        return response;
    }
}

module.exports= BookingRepository