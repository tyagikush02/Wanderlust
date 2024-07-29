const Listing = require("../models/listing");
const Review = require("../models/review");
const {reviewSchema}=require("../schema.js");

module.exports.addReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    console.log(listing);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview)
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","review added successfully");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview=async (req, res) => {
    let { id,id2 } = req.params;
    let result=await Listing.findByIdAndUpdate(id,{$pull : {review:id2}});
    // console.log(result);
    let data=await Review.findByIdAndDelete(id2);
    req.flash("success","review deleted successfully");
    res.redirect(`/listings/${id}`);
};