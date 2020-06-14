var express         = require("express"),
    router          = express.Router(),
    Question        = require("../models/questions"),
    Answer          = require("../models/answers");
    
    


router.get("/questions/:id/profile" ,function(req,res){
 
    Question.find({}).populate("answers").exec(function(err ,foundQuestion){
        if(err){
            console.log(err);
        }else{
              res.render("profile/show" ,{userId: req.params.id , questions:foundQuestion});
            //console.log(foundAnswer);
        }
    });
});

module.exports = router;