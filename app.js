if(process.env.NODE_ENV !== 'production') {
    // Load environment variables from .env file in development
require('dotenv').config();
}

const express = require('express'); 
const app = express();
const Listing = require('./models/listing.js');
const Review = require('./models/review.js');

const path = require('path');
const methodOverride = require('method-override');
app.use(methodOverride('_method')); // For PUT and DELETE requests

const mongoose = require('mongoose');
app.use(express.urlencoded ({ extended: true }));   
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const ejsmate = require('ejs-mate');
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"/public"))); // Serve static files from the public directory
const Joi = require('joi');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const mongoatlasurl = process.env.mongoatlasurl;

const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js'); 

const { isLoggedIn } = require('./middleware.js'); // Import the isLoggedIn middleware


const { listingSchema, reviewSchema } = require('./schema.js');

const mongostoresession = MongoStore.create({
    mongoUrl: mongoatlasurl,
    crypto: {
        secret: process.env.secret, // Replace with your own secret key
    },
    touchAfter: 24 * 3600 // Time in seconds after which the session will be updated
});


mongostoresession.on('error', function(e) {
    console.log('Session store error', e);
});

const sessionOptions = {
    mongostoresession,
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,    
    cookie: {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 1000 * 60 * 60 * 24 * 7 // Cookie expiration time (1 week)
    }
};



app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // Use the authenticate method from passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // Make the current user available in all views
    next();
});





const listingsRoutes = require('./routes/listing.js');
app.use('/listings', listingsRoutes);

const reviewsRoutes = require('./routes/review.js');
app.use('/', reviewsRoutes);

const userRoutes = require('./routes/user.js');
app.use('/', userRoutes);


main()
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

async function main(){
    await mongoose.connect(mongoatlasurl);
}


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

app.get('/', (req, res) => {
    res.redirect('/listings');
});

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });








// Uncomment the following code to create a sample listing

// app.get("/listings", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Sample Listing",
//         description: "This is a sample listing description.",
//         price: 100,
//         location: "Sample Location",
//         images: ["https://images.unsplash.com/photo-1748178765097-1c012c848596?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
//         amenities: ["WiFi", "Air Conditioning", "Kitchen"],
//         hostId: "60c72b2f9b1e8b001c8e4a2b" // Example ObjectId
//     }); 
//     sampleListing = await sampleListing.save();
//     res.send("success");
// });


