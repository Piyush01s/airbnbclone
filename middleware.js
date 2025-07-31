const Listing = require('./models/listing');
const review = require('./models/review');
const User = require('./models/user');
const { listingSchema, reviewSchema } = require('./schema.js');

module.exports.validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body.review);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body, listingSchema.listing);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be signed in first!");
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to edit this listing");
        return res.redirect("/listing"+`/${id}`);
    }
    next();
}

// module.exports.isAuthor = async (req, res, next) => {
//     const { reviewId } = req.params;
//     const review = await Review.findById(reviewId).populate('author');
//     if (!review.author._id.equals(res.locals.currentUser._id)) {
//         req.flash("error", "You do not have permission to delete this review");
//         return res.redirect("/listing"+`/${review.listing}`);
//     }   
//     next();

// }


module.exports.isAuthor = async (req, res, next) => {
    const { listingId, reviewId } = req.params;
    let newreview = await review.findById(reviewId);
    if (!newreview.author._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "you are not the author of this review");
        return res.redirect("/listing"+`/${listingId}`);
    }
    next();
}