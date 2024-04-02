const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PredictPriceSchema = new Schema({
    road: {
        type: String,
        required: true,
    },
    predicted_price: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("PredictPrice", PredictPriceSchema);