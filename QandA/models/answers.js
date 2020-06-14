var mongoose = require("mongoose");

var answerSchema = new mongoose.Schema({
    answer: String,
    created: {type: Date ,default: Date.now},
    likes: Number,
    likeFlag:[
         {
            id:{
               type: mongoose.Schema.Types.ObjectId,
               ref: "User"
            },
            flag: Number
         }
      ],
    question: 
    {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
    },
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        profilePhoto: String
    }
});

module.exports = mongoose.model("Answer",answerSchema);