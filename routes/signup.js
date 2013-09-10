'use strict';

var mongoose  = require('mongoose'),
    models    = mongoose.models,
    passport  = require('passport');

exports.get = function (req, res) {
  
  if (req.user) {
    res.redirect('/');
  }

  res.render('signup', {
    title: 'Sign Up',
    subTitle: 'It\'s free and always will be',
    errorFlash: req.flash('error')
  });

};

exports.post = function (req, res) {

  var u = new models.User(req.body);

  u.save(function (err, user, next) {
    
    if (err) {
      req.flash('error', err);
      res.redirect('/signup');
      return;
    }

    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: 'Wrong Username or Password',
    })(req, res, next);

  });

};