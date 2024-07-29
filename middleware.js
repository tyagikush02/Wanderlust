const {listingSchema,reviewSchema} = require("./schema.js");
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js")

module.exports.logged=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","please login");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectedUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectedUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(res.locals.currUser && !listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not allowed");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isAuthor=async(req,res,next)=>{
    let { id,id2 } = req.params;
    let review = await Review.findById(id2);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not allowed");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing = (req,res,next) =>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
};

module.exports.validateReview = (req,res,next) =>{
    let {error}=reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
} ;
