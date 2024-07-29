const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {logged, isOwner, validateListing}=require("../middleware.js");

//                                                image upload
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});
 
const listingController=require("../controllers/listings.js");


//{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{index Route}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
router.get("/",wrapAsync(listingController.index));


//{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{Add Route}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
router.get("/new",logged, wrapAsync(listingController.renderAddForm));
router.post("/",logged,upload.single("listing[image]"),validateListing,wrapAsync(listingController.addListing));

//{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{show Route}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
router.get("/:id",wrapAsync(listingController.showListing));

//{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{Update Route}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
router.get("/:id/edit",isOwner,logged,wrapAsync(listingController.renderEditForm));
router.patch("/:id",logged,isOwner,upload.single("listing[image]"),wrapAsync(listingController.editListing));

//{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{Delete Route}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
router.delete("/:id",logged,isOwner,wrapAsync(listingController.destroyListing));


module.exports=router;
