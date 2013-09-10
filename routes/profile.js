'use strict';
var mongoose = require('mongoose');
var models = mongoose.models;

exports.get = function (req, res) {

  res.render('profile', {
    title: 'User Profile',
    user: req.user,
    errorFlash: req.flash('error'),
    infoFlash: req.flash('info')
  });

};

exports.post = function (req, res) {
  
  var newPassword = req.body.newpassword.trim();
  var confirmPassword = req.body.confirmpassword.trim();

  if (!req.user) {
    res.redirect('/');
    return;
  }

  if (newPassword.length === 0 || newPassword === '') {
    req.flash('error', 'New Password Can\'t be blank!');
    res.redirect(req.url);
    return;
  }

  if (newPassword !== confirmPassword) {
    req.flash('error', 'New Password does not match the Password Confirmation');
    res.redirect(req.url);
    return;
  }

  req.user.updatePassword(newPassword, function (err, result) {
    
    if (!err) {
      req.flash('info', 'Password updated successfully!');
      res.redirect(req.url);
      return;
    }

    req.flash('error', 'Password change unsuccessful!');
    res.redirect(req.url);

  });

};