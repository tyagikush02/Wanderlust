const User=require("../models/user.js");

module.exports.signUp=(req,res)=>{
    res.render("users/signup.ejs");
}


module.exports.register=async(req,res)=>{
    try{
        let user = new User(req.body.user);
        let {password}=req.body;
        let registredUser= await User.register(user,password);
        req.login(registredUser,(err)=>{
            if(err){
                return  next(err);
            }
            req.flash("success","login succesfully!");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.loginIn=async (req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    let redirectedUrl=res.locals.redirectedUrl;
    redirectedUrl=redirectedUrl ? redirectedUrl:"/listings";
    res.redirect(redirectedUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return  next(err);
        }
        req.flash("success","logout succesfully!");
        res.redirect("/listings");
    });
};