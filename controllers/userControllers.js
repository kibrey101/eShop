var passport = require("passport");
var User = require("../models/user");
var passportConf = require("../config/passport");
var async = require("async");
var Cart = require("../models/cart");

exports.renderSignup = function (req, res) {
    if(req.user){
        return res.redirect("/");
    }
    res.render("user/signup", {
        errors: req.flash("errors")
    });
};

exports.signup = function (req, res, next) {

    async.waterfall([
        function (callback) {
            var user = new User();

            user.profile.firstName = req.body.firstName;
            user.profile.lastName = req.body.lastName;
            user.email = req.body.email;
            user.password = req.body.password;
            user.profile.picture = user.gravatar();
            User.findOne({email: req.body.email}, function (err, existingUser) {
                if(err) return next(err);

                if(existingUser){
                    req.flash("errors", "Account with that email already exists");
                    return res.redirect("/signup")
                } else {
                    user.save(function (err) {
                        if(err) return next(err);

                        callback(null, user);
                    })
                }
            });
        },

        function (user) {
            var cart = new Cart();
            cart.owner = user._id;
            cart.save(function (err) {
                if(err) return next(err);

                req.logIn(user, function (err) {
                    if(err) return next(err);
                    return res.redirect("/");
                });
            });
        }
    ]);

};

exports.renderLogin = function (req, res) {
    if(req.user) return res.redirect("/");
    res.render("user/login", {
        message: req.flash("loginMessage")
    });
};

exports.login = passport.authenticate("local-login",{
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
});

exports.renderProfile = function (req, res, next) {
   User.findById({_id: req.user._id}, function (err, user) {
       if(err) return next(err);

       res.render("user/profile", {user: user});
   })
};

exports.logout = function (req, res) {
   req.logOut();
    return res.redirect("/");
};

exports.renderEdit = function (req, res) {
    if(!req.user) return res.redirect("/");
    res.render("user/edit", {message: req.flash("message"),error: req.flash("error")});
    
};

exports.edit = function (req, res, next) {

    User.findOne({_id: req.user._id }, function (err, user) {

        if(err) return next(err);

        if(req.body.firstName) user.profile.firstName = req.body.firstName;
        if(req.body.lastName) user.profile.lastName = req.body.lastName;
        if(req.body.address) user.address = req.body.address;

        user.save(function (err) {
            if(err) return next(err);
            req.flash("message", "user info updated successfully");
            return res.redirect("/edit-profile");
        });
    });
};


