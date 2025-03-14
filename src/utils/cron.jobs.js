
const cron = require("node-cron")
const {bookingService} = require("../services/index.js");

function cronJob(){
    // cron.schedule('* * * * *', ()=>{
    //     console.log("schedules this every minute");
    // })
    cron.schedule('*/30 * * * *', async()=>{
        await bookingService.cancelOldBookings();
    })
}

module.exports=cronJob;