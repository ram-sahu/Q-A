//This is the Questions model

var mongoose = require("mongoose");

var qSchema = new mongoose.Schema({
   question : String,
   author:{
        id:{
            type: mongoose.Schema.Types.ObjectId, 
            ref:"User"
        },
        username: String
    },
   answers :[
       {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
        }
        ]
});

module.exports = mongoose.model("Question",qSchema);