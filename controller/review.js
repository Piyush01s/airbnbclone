
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { reviewSchema } = require('../schema.js');


module.exports.addReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    listing.reviews.push(newReview._id); // Push only the ObjectId
    await listing.save();
    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${listing._id}`); // Make sure this matches your route
};

module.exports.editReview = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate('owner');
    res.render('./listings/listing.ejs', {listing});
};

module.exports.deleteReview = async (req, res) => {
    const { listingId, reviewId } = req.params;
    await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listing/${listingId}`);
};
