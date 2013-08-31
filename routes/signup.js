/*
 * Get Signup
 */
'use strict';
var mongoose = require('mongoose'),
    models = mongoose.models;

exports.get = function(req, res) {
    if (req.user) {
        res.redirect('/');
    }
    res.render('signup', {
        title: 'User Registration',
        subTitle: 'It\'s free and always will be',
        errorFlash: req.flash('error')
    });
};
exports.post = function(req, res) {
    var u = new models.User(req.body);
    u.save(function(err, user) {
        if (err) {
            req.flash('error', err);
            res.redirect('/signup');
            return;
        }
        req.flash('info', 'Thanks for signing up ' + user.email + '! You may now login.');
        res.redirect('/login');
    });
};
