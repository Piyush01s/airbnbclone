const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const User = require('../models/user.js');

module.exports.allListings = async (req, res) => {
const listings = await Listing.find({});
        res.render('./listings/listings.ejs', { listings: listings });
};

module.exports.getListingById = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate('owner');
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }- 
    res.render('./listings/listing.ejs', {listing});
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body);
    if (req.file !== undefined) {
       const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }
    req.flash("success", "Listing updated successfully!");
    res.redirect("/listing"+`/${id}`);
};

module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    res.render('./listings/edit.ejs', {listing});

};

module.exports.createListing = async (req, res) => {
    const url = req.file.path;
    const filename = req.file.filename;
    const listing = new Listing(req.body);
    listing.owner = req.user._id; // Set the owner to the current user
    listing.image = { url, filename }; // Set the image URL and filename
    await listing.save();
    req.flash("success", "Listing created successfully!");
    
    res.redirect('/listings');
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect('/listings');
};
