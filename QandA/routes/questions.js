//Questions Route
var express    = require("express"),
    router     = express.Router(),
    Question   = require("../models/questions"),
    Answer     = require("../models/answers"),  
    User       = require("../models/user"), 
    middleware = require("../middleware");

//Show all questions and answers Page or Index page
router.get("/questions", middleware.isLoggedIn,function(req,res){
    //Find all questions and Answers.
   Question.find({}).populate("answers").exec(function(err , allQuestions){
      if(err){
          console.log(err);
      } else{
          res.render("questions/index" ,{questions: allQuestions , User: User});
      }
   }); 
});

//Add new question to Database
router.post("/questions" , middleware.isLoggedIn ,function(req,res){
   var question = req.body.question;
   var author = {
      id : req.user._id,
      username: req.user.username
   }
   var newQuestion = {question: question , author: author};
   Question.create(newQuestion ,function(err ,newQuestion){
      if(err){
          console.log(err);
      } else{
          res.redirect("/questions");
      }
   });
});

//Show all answers to that question
router.get("/questions/:id" ,function(req, res) {
   Question.findById(req.params.id).populate("answers").exec(function(err,foundQuestion){
      if(err){
         console.log(err);
      }else{
         res.render("questions/show" , {question: foundQuestion});
      }
   }); 
});

//This will take us to edit Page for question
router.get("/questions/:id/edit", middleware.checkQuestionOwnership ,function(req,res){
    Question.findById(req.params.id ,function(err ,que){
       if(err){
           console.log(err);
       } else{
           res.render("questions/edit", {question: que});
       }
    });
});

//Question will be edited
router.put("/questions/:id" , middleware.checkQuestionOwnership , function(req,res){
   Question.findByIdAndUpdate(req.params.id , req.body.q ,function(err,updatedQuestion){
      if(err){
          console.log(err);
      } else{
          res.redirect("/questions");
      }
   }); 
});

//Question will be deleted
router.delete("/questions/:id" , middleware.checkQuestionOwnership , function(req,res){
   Question.findByIdAndRemove(req.params.id ,function(err){
       if(err){
           console.log(err);
       }else{
           res.redirect("/questions");
       }
   }) 
});

module.exports = router;