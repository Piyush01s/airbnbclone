const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js'); 

const imageSchema = new mongoose.Schema({
  filename: String,
  url: String
});

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image:{
        type: [imageSchema],  
    },
   
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },  
    reviews : [{
        type: Schema.Types.ObjectId,
        ref: 'Review' 
    }], 
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    
}, 
{ timestamps: true });

ListingSchema.post('findOneAndDelete', async function(listing) {
    if (listing) {
        await Review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        });
    }
});


const Listing = mongoose.model('Listing', ListingSchema);
module.exports = Listing;

