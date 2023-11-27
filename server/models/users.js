const mongoose = require("mongoose")
const usersSchema = new mongoose.Schema({
    email:String,
    password:String,
    verified:Boolean
})
const UserModel = mongoose.model('users',usersSchema)
module.exports = UserModel
