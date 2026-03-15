const mongoose = require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("CONNECTED TO MONGODB");
    }catch(err){
        console.log("ERROR CONNECTING TO MONGODB",err);
        process.exit(1);
    }
}

module.exports = connectDB;
