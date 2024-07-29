const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectedUrl} = require("../middleware.js");


const userController=require("../controllers/users.js");

//                                                       SignUP

router.get("/signup",wrapAsync(userController.signUp));

router.post("/signup",wrapAsync(userController.register));

//                                                       Login

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectedUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),wrapAsync(userController.loginIn));


//                                                      Logout


router.get("/logout",userController.logout);

module.exports=router;