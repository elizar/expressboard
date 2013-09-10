'use strict';

var mongoose  = require('mongoose'),
    models    = mongoose.models;

exports.get = function (req, res) {
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

exports.post = function (req, res) {
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
  thread.save(function (err, thread) {

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

    p.save(function (err, post) {
      if (!err) {
        req.user.updateThreads(thread._id);
        req.user.updatePosts(post._id);
        thread.updatePosts(post._id);
      }
    });

    req.flash('info', 'Thread successfully added!');
    res.redirect('/threads/' + thread.slug);

  });

};