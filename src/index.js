
const express= require('express');
const {serverPort} = require('./config/index.js');
const apiRoutes = require('./routes/index.js');
const crons=require("./utils/cron.jobs.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/api', apiRoutes);

app.listen(serverPort.PORT , ()=>{
    console.log(`Server is listening on port : ${serverPort.PORT}`); 
    crons();
})


