const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const flash = require('connect-flash');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controller/user.js');


router
    .route("/signup")
    .get(userController.signupform) //signup route
    .post(userController.signup);// Handle user signup



router
    .route('/login')
    .get(userController.loginform)//login route
    .post(saveRedirectUrl,
    passport.authenticate('local',{ failureRedirect: "/login", failureflash: true }), // Handle user login
    userController.login);

router.get('/logout', userController.logout);



module.exports = router;

