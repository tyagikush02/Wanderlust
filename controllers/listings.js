const Listing=require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index=async (req,res)=>{
    if(req.query.country){
        const regexPattern = new RegExp(req.query.country.trim(), 'i');
        let listings=await Listing.find({country: regexPattern});
        if(listings.length>0){
            return res.render("listings/index.ejs",{listings});
        }
        else{
            req.flash("error","invalid country name");
            return res.redirect("/listings");
        }
    }
    if(req.query.category){
        let listings=await Listing.find(req.query);
        if(listings.length>0){
            return res.render("listings/index.ejs",{listings});
        }
        else{
            req.flash("error","no such category exist");
            return res.redirect("/listings");        
        }
    }
    let listings = await Listing.find();
    res.render("listings/index.ejs",{listings});
};


module.exports.renderAddForm=async (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.addListing=async (req, res,next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    let newListing = await new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","listing added successfully");
    res.redirect("/listings");
};

module.exports.showListing=async (req, res) => {
    let {id}= req.params;
    let listing = await Listing.findById(id)
    .populate({path:"review",
        populate:{
            path:"author"
        },
    })
    .populate("owner");
    res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    let listing= await Listing.findById(id);

    let originalImgUrl=listing.image.url;
    originalImgUrl=originalImgUrl.replace("/upload","/upload/w_150");
    res.render("listings/edit.ejs", { listing ,originalImgUrl});
};

module.exports.editListing=async (req,res)=>{
    let { id } = req.params;
    console.log(req.body.listing);
    let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(listing);
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        console.log(listing);
        await listing.save();
    }
    
    req.flash("success","listing updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let  deleteData=await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully");
    res.redirect("/listings");
};