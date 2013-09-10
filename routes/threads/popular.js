'use strict';

var mongoose  = require('mongoose'),
    models    = mongoose.models;

exports.get = function (req, res) {

  if (!req.user) {
    res.redirect('/login');
    return;
  }

  models.Thread.find({})
  .$where('this.posts.length > 5')
  .populate('posts')
  .populate('owner', 'username')
  .exec(function (err, results) {

    if (!err) {
      res.render('threads/popular_threads', {
        title: 'Popular Threads',
        url: req.url,
        user: req.user,
        threads: results,
        errorFlash: req.flash('error'),
        infoFlash: req.flash('info')
      });
    }

  });

};