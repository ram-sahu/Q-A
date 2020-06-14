//Answers Route
var express     = require("express"),
    router      = express.Router(),
    Question    = require("../models/questions"),
    Answer      = require("../models/answers"),
    middleware  = require("../middleware"),
    bodyParser  = require("body-parser");

router.use(bodyParser.json());

//This takes us to answer form
router.get("/questions/:id/answers/new", middleware.isLoggedIn ,function(req,res){
   Question.findById(req.params.id ,function(err ,question){
       if(err){
           console.log(err);
       }else{
           res.render("answers/new" ,{question: question});
       }
   }); 
});

//This adds the answer with appropriate question
router.post("/questions/:id", middleware.isLoggedIn ,function(req,res){
    Question.findById(req.params.id ,function(err,question){
       if(err){
           console.log(err);
       } else{
           var ans = req.body.answer;
           var a ={
               answer: ans,
               likes: 0,
               question_id: req.params.id
           };
           Answer.create(a ,function(err,answer){
              if(err){
                  console.log(err);
              } else{
                  //add username and id to answer Model
                  answer.author.id = req.user._id;
                  answer.author.username = req.user.username;
                  answer.author.profilePhoto = req.user.profilePhoto;
                  //save the answer
                  answer.save();
                  question.answers.push(answer);
                  question.save();
                  res.redirect("/questions/" + question._id);
              }
           });
       }
    });
});

//This will take us to edit Page for answer
router.get("/questions/:id/answers/:answer_id/edit" , middleware.checkAnswerOwnership , function(req,res){
    Answer.findById(req.params.answer_id ,function(err ,ans){
       if(err){
           console.log(err);
       } else{
           res.render("answers/edit", {question_id: req.params.id , answer: ans});
       }
    });
});

//Answer Edited
router.put("/questions/:id/answers/:answer_id", middleware.checkAnswerOwnership , function(req,res){
    var a={
        answer: req.body.text,
        question_id: req.params.id
    }
   Answer.findByIdAndUpdate(req.params.answer_id ,a ,function(err ,updatedAnswer){
     if(err){
         console.log(err);
     }  else{
         res.redirect("/questions/" + req.params.id);
     }
   });
});

//Delete an Answer
router.delete("/questions/:id/answers/:answer_id" , middleware.checkAnswerOwnership , function(req,res){
   Answer.findByIdAndRemove(req.params.answer_id ,function(err){
      if(err){
          console.log(err);
      } else{
          res.redirect("/questions/" + req.params.id);
      }
   }); 
});

//AJAX Routes

router.post("/mo",function(req, res) {
    var y =0 ;
    var id = req.body.lid;
    var likes = req.body.likes;
    Answer.findById(id ,function(err, answer) {
        if(err){
            console.log("error");
        }else{
            answer.likeFlag.forEach(function(i){
                if(i.id.equals(req.user._id)){
                    if(i.flag==0){
                        i.flag=1;
                        answer.likes = likes;
                        answer.save();
                    }else{
                        i.flag=0;
                        answer.likes = likes;
                        answer.save();
                    }
                    y++;
                } 
            });
            if(y == 0){
                var l = {
                    id: req.user._id,   
                    flag: 1
                };
                answer.likes = answer.likes + 1;
                answer.likeFlag.push(l);
                answer.save();
            }
        }
    });
    res.send("Success");
});

module.exports = router;