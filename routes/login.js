'use strict';
var passport = require('passport');
exports.get = function(req, res) {
    if (req.user) {
        res.redirect('/');
        return;
    }
    res.render('login', {
        title: 'User Login'
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
        failureFlash: 'Invalid Username or Password',
        successFlash: 'Welcome!'
    })(req, res, next);
};
