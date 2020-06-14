var Question = require("../models/questions");
var Answer    = require("../models/answers");
var middlewareObj ={};

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

middlewareObj.checkQuestionOwnership = function(req ,res ,next){
    if(req.isAuthenticated()){
        Question.findById(req.params.id , function(err , foundQuestion){
            if(err){
                res.redirect("back");
            }else{
                if(foundQuestion.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
}

middlewareObj.checkAnswerOwnership = function(req ,res ,next){
    if(req.isAuthenticated()){
        Answer.findById(req.params.answer_id , function(err , foundAnswer){
        if(err){
            res.redirect("back");
        }else{
            if(foundAnswer.author.id.equals(req.user._id)){
                next();
            }else{
                res.redirect("back");
            }
        }
        });
    }else{
        res.redirect("back");
    }
}



module.exports = middlewareObj;