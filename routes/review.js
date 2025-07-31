const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { reviewSchema } = require('../schema.js');
const { isLoggedIn, isAuthor, validatereview} = require('../middleware.js');
const { isOwner } = require('../middleware.js'); // Import the isOwner middleware

const reviewcontroller  = require('../controller/review.js');



// Create a new review
router.post("/listings/:id/reviews", validatereview, isLoggedIn, reviewcontroller.addReview); 

// Edit a review
router.get('/listing/:id', reviewcontroller.editReview);


// delete a review
router.delete("/listings/:listingId/reviews/:reviewId", isLoggedIn, isAuthor, reviewcontroller.deleteReview);

module.exports = router;