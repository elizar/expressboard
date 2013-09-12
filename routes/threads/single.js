'use strict';

var mongoose  = require('mongoose'),
    models    = mongoose.models;

exports.get = function (req, res, next) {
  if (!req.user) {
    res.redirect('/login');
    return;
  }

  var slug = req.params.thread;

  if (slug === undefined || slug === 'new' || slug === 'popular') {
    next();
    return;
  }

  models.Thread.findOne({slug: slug})
  .populate('owner', 'username')
  .exec(function (err, th) {
    
    models.Post.find({
      thread: th._id
    }).populate('owner').exec(function (err, po) {

      if (!err) {
        res.render('threads/single_threads', {
          title: th.title,
          url: req.url,
          user: req.user,
          thread: th,
          posts: po,
          errorFlash: req.flash('error'),
          infoFlash: req.flash('info')
        });
      }

    });

  });
};

exports.post = function (req, res, next) {

  if (req.params.thread === 'new') {
    next();
    return;
  }

  if (req.body.message.trim() === '' || req.body.message.trim().length < 10) {
    req.flash('error', 'Your post should not be blank, should be at least 10 characters long.');
    res.redirect(req.url + '#form');
    return;
  }

  var postData = {
    message: req.body.message.trim(),
    owner: req.user._id,
    thread: req.body._id
  };

  var p = new models.Post(postData);

  p.save(function (err, post) {

    if (!err) {

      req.user.updatePosts(post._id);

      models.Thread.findOneAndUpdate(
      { _id: post.thread },
      { $push: { posts: post._id } },
      function (err, th) {
        if (!err && th) {
          req.flash('info', 'Post successfully added!');
          res.redirect(req.url + '#form');
        }
      });

    } else {
      req.flash('error', 'Invalid post. Your post should not contain any html tag use markdown instead.');
      res.redirect(req.url + '#form');
      return;
    }

  });

};