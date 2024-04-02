const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContractSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    company_id:{
        type:String,
        required:true
    },
    company_name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required:true,
    },
    location:{
        type:String,
        required:true
    },
    road:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    predicted_price:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Contract',ContractSchema)