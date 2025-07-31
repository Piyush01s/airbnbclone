const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const User = require('../models/user.js');

const { listingSchema } = require('../schema.js');
const flash = require('connect-flash');
router.use(flash());

const { cloudinary, storage } = require('../cloudConfig.js'); // Import cloudinary and storage configuration
const multer = require('multer');
const upload = multer({ storage }); // Set the destination for uploaded files  

const { isLoggedIn, isOwner, validateListing  } = require('../middleware.js'); // Import the isLoggedIn middleware

const listingController = require('../controller/listing.js');


router.get("/new",isLoggedIn, (req, res) => {
    res.render('./listings/new.ejs');
});

router 
    .route('/')
    .get(listingController.allListings) // Use the controller method for all listings); // Get all listings
    .post(isLoggedIn,upload.single('listing[image]'), listingController.createListing); // Use the controller method for creating a listing // Create a new listing
    



// edit a listing
router.get("/:id/edit", isLoggedIn,isOwner, listingController.editListing); // Use the controller method for editing a listing

router
    .route("/:id")
    .get(listingController.getListingById) // Get a listing by ID   // Use the controller method for getting a listing by ID 
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), listingController.updateListing) // update a listing  // Use the controller method for updating a listing 
    .delete(isLoggedIn,isOwner, listingController.deleteListing); // Delete a listing // Use the controller method for deleting a listing


module.exports = router;