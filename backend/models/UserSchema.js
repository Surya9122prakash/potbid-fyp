const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    role: {
        type: String,
        enum: ['public', 'company','admin'],
    },
    verified:{
        type:Boolean,
        required:true
    },
})



module.exports = mongoose.model('User',UserSchema)