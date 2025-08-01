const User = require('../models/user.js');
const passport = require('passport');

module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
    const newUser = new User({ username, email});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
        if(err){
            req.flash("error", "login failed");
            return res.redirect("/signup");
        }
            req.flash("success", "Welcome to Airbnb Clone!");
            res.redirect('/listings');
    });

    }
    catch (e) {
        req.flash("error", "user already exists");
        res.redirect("/signup");
        res.send('signup error: ' + e.message);
    }
};

module.exports.login = async (req, res) => {
        req.flash('success', 'Welcome back!');
        res.redirect(res.locals.redirectUrl || '/listings');
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect('/login');
    });
};

module.exports.signupform = async (req, res) => {
    res.render('user/signup.ejs');
};

module.exports.loginform =  (req, res) => {
    res.render('user/login.ejs');
};

