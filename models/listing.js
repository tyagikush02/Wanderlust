const mongoose = require("mongoose");
const Review=require("./review.js");
const User=require("./user.js");

const listingSchema= mongoose.Schema({
    title:{
        type: String,
        required:true,
    },
    description:String,
    image:{
        url: String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    review:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    category:{
        type:String,
    },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        let res=await Review.deleteMany({_id: {$in: listing.review }});
        console.log(res);
    }
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;