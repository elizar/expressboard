'use strict';
var passport = require('passport');
exports.get = function(req, res) {
    if (req.user) {
        res.redirect('/');
        return;
    }
    res.render('login', {
        title: 'User Login',
        subTitle: 'Login to post, comment, and troll arround',
        errorFlash: req.flash('error'),
        infoFlash: req.flash('info'),
    });
};
exports.post = function(req, res, next) {
    if (req.user) {
        res.redirect('/');
        return;
    }
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: 'Wrong Username or Password',
    })(req, res, next);
};
