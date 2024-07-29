if(process.env.Node_ENV != "production"){
    require("dotenv").config();
}
const dbUrl=process.env.ATLAS_URL;

const express=require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");



app.use(express.urlencoded({extended:true}));

const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);



//                                               All ROUTES
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");



//                                                Session
const session =require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};


app.use(session(sessionOptions));



//                                                for configuring strategy (after session)
const User =require("./models/user.js");
const passport = require("passport");
const LocalStrategy=require("passport-local");


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//                                                     setting flash before routes
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    res.locals.currUser=req.user;
    next();
});


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



//                                                             Database
main().then((res)=>{
    console.log("connection successful");
})
.catch((e)=>{
    console.log(e);
})


async function main(){
    mongoose.connect(dbUrl);
}


//                                                            Middleware

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});
app.use((err, req, res, next) => {
    let {status=500,message="some error ocuured"} =err;
    res.status(status).render("error.ejs",{status,message});
    // res.status(status).send(message);
});



app.listen(port,(res,req)=>{
    console.log(`App is listening on ${port}`);
});