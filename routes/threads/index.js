'use strict';

var mongoose  = require('mongoose'),
    models    = mongoose.models;

exports.get = function (req, res) {

  if (!req.user) {
    res.redirect('/login');
    return;
  }

  models.Thread.find()
  .populate('posts')
  .populate('owner', 'username')
  .exec(function (err, results) {

    if (!err) {
      res.render('threads/all_threads', {
        title: 'Threads',
        url: req.url,
        user: req.user,
        threads: results,
        errorFlash: req.flash('error'),
        infoFlash: req.flash('info')
      });
    }

  });

};