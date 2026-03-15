const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required:true
    },
    description: {
        type: String,
        default: ""
    },
    website: {
        type: String,
        default: ""
    },
    logo:{
        type: String,
        default: ""
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps: true});

module.exports = mongoose.model("Company",companySchema);
