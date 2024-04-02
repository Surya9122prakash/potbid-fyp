const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ComplainSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  road: {
    type: String,
    required: true,
  },
  location: {
    address: {
      type: String,
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  message: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  status:{
    type : String,
    required: true
  }
});

module.exports = mongoose.model("Complain", ComplainSchema);
