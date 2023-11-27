const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required:true,
        ref:"users",
        unique: false,
    },
    
    title:String,
});
module.exports = mongoose.model("categories",categorySchema);