const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const todoSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required:true,
        ref:"users",
        unique: false,
    },
    categoryId:{
        type: Schema.Types.ObjectId,
        required:true,
        ref:"category",
        unique: false,
    },
    title:String,
    description:String,
    createdAt:Date,
    completedAt:Date,
    isCompleted:Boolean,
});
module.exports = mongoose.model("todos",todoSchema);