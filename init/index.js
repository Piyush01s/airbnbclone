const mongoose = require('mongoose');
const initdata = require("./data.js");
const Listing = require('../models/listing.js');

main()
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

const initdb = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((each) => ({ ...each, owner: "6883d7ab9f6e8c59cca0faf6" })); // Assigning owner to each listing
    await Listing.insertMany(initdata.data);
    console.log("Database initialized with sample data");
}
initdb();