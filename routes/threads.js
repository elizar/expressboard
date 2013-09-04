'use strict';
var mongoose = require('mongoose'),
  models = mongoose.models,
  utils = require('../lib/utils'),
  async = require('async');

exports.get = function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
    return;
  }

  // Skip if req.params.page is not 'all' and req.params.page is not undefined
  if (req.params.page !== 'all' && req.params.page !== undefined) {
    next();
    return;
  }

  var filter = {
    owner: req.user._id
  },
    template = 'threads/own_threads',
    title = 'Own Threads';

  if (req.params.page === 'all') {
    filter = {};
    template = 'threads/all_threads';
    title = 'Everyone\'s Threads';
  }
  // ASYNC FTW!
  async.series([
    function(cb) {
      // Get all threads from this user
      models.Thread
        .find(filter)
        .populate('posts')
        .populate('owner', 'username')
        .exec(cb);
    },
    function(cb) {
      models.Post
        .find(filter)
        .populate('thread')
        .exec(cb);
    }
  ], function(err, results) {
    if (!err) {
      res.render(template, {
        title: title,
        url: req.url,
        user: req.user,
        threads: results[0],
        posts: results[1],
        errorFlash: req.flash('error'),
        infoFlash: req.flash('info')
      });
    }
  });
};

exports.new = function(req, res) {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  res.render('threads/new_thread_form', {
    title: 'Create New Thread',
    url: req.url,
    user: req.user,
    errorFlash: req.flash('error'),
    infoFlash: req.flash('info')
  });
};

exports.newthread = function(req, res) {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  
  if (req.body.title.trim() === '' || req.body.description.trim() === '') {
    req.flash('error', 'Problem processing your request. Please try again');
    res.redirect(req.url);
    return;
  }

  var title = req.body.title.trim();
  var threadData = {};
  threadData.title = title;
  threadData.owner = req.user._id;

  var thread = new models.Thread(threadData);
  thread.save(function(err, thread) {
    if (err) {
      req.flash('error', err);
      res.redirect('/threads/new');
      return;
    }
    var postData = {
      message: req.body.description.trim(),
      owner: req.user._id,
      thread: thread._id
    };
    var p = new models.Post(postData);
    p.save(function(err, post) {
      if (!err) {
        // Update users' threads sub documents
        req.user.updateThreads(thread._id);
        // Update user's posts sub documents
        req.user.updatePosts(post._id);
        // Update thread's post sub documents
        thread.updatePosts(post._id);
        // Update post's owner
      }
    });
    req.flash('info', 'Thread successfully added!');
    res.redirect('/threads/' + thread.slug);
  });

};

exports.single = function(req, res, next) {

  var slug = req.params.thread;

  if (slug === undefined || slug === 'new') {
    next();
    return;
  }

  models.Thread
    .findOne({
      slug: slug
    })
    .populate('owner', 'username')
    .exec(function(err, th) {
      models.Post.find({
        thread: th._id
      })
      .populate('owner', 'username')
      .exec(function(err, po) {
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

exports.newpost = function(req, res, next) {
  if (req.params.thread === 'new') {
    next();
    return;
  }

  if (req.body.message.trim() === '' || req.body.message.trim().length < 10) {
    req.flash('error', 'Your post should not be blank, should be at least 10 characters long.');
    res.redirect(req.url+'#form');
    return;
  }

  var postData = {
    message: req.body.message.trim(),
    owner: req.user._id,
    thread: req.body._id
  };

  var p = new models.Post(postData);
  p.save(function(err, post) {
    if (!err) {
      // Update user's posts sub documents
      req.user.updatePosts(post._id);
      // Update thread's post sub documents
      var thread = models.Thread.findOneAndUpdate({
        _id: req.body._id
      }, {
        $push: {
          posts: post._id
        }
      }, function(err, th) {
        if (!err) {
          req.flash('info', 'Post successfully added!');
          res.redirect(req.url+'#form');
        }
      });
      // Update post's owner
    } else {
      req.flash('error', 'Invalid post. Your post should not contain any html tag use markdown instead.');
      res.redirect(req.url+'#form');
      return;
    }
  });
};
