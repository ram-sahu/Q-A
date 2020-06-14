var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Route for home page.
router.get("/",function(req,res){
   res.render("homePage");
});

//It takes us to the register form
router.get("/register",function(req, res) {
   res.render("register"); 
});

//This enters the new user into the user collection
router.post("/register",function(req, res) {
   User.register(new User({username: req.body.username , profilePhoto: "anonymous"}), req.body.password , function(err,user){
      if(err){
          req.flash("error",err.message);
          res.redirect("/register");
      } 
      passport.authenticate("local")(req,res,function(){
          res.redirect("/questions");
      });
   }); 
});

//This takes us to login page and shows the login form
router.get("/login",function(req, res) {
   res.render("login"); 
});

//This verifies the username and password and logs the user in
router.post("/login",passport.authenticate("local",{
    successRedirect: "/questions",
    failureRedirect: "/login"
}),function(req, res) {
    });

//This Logs us out from the current Session
router.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;