const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");

const Review=require("../models/review.js");
const Listing =require("../models/listing.js");
const {logged, isAuthor, validateReview} = require("../middleware.js");



const reviewController=require("../controllers/reviews.js");

//{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{Create Review Route}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}

router.post("/",logged,validateReview,wrapAsync(reviewController.addReview));

//{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{Delete Review Route}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}

router.delete("/:id2",logged,isAuthor, wrapAsync(reviewController.destroyReview));

module.exports=router;