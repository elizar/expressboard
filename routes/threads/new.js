'use strict';

var mongoose  = require('mongoose'),
    models    = mongoose.models,
    async     = require('async');

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

  var title = req.body.title.trim();
  var threadData = {};
  threadData.title = title;
  threadData.owner = req.user._id;

  var thread = new models.Thread(threadData);
  thread.save(function (err, thread) {

    if (err) {
      req.flash('error', err);
      return res.redirect('/threads/new');
    }

    req.user.updateThreads(thread._id, function (err, results) {

      if (!err) {
        var postData = {
          message: req.body.description.trim(),
          owner: req.user._id,
          thread: thread._id
        };
        var p = new models.Post(postData);
        p.save(function (err, post) {
          if (!err) {
            req.user.updatePosts(post._id, console.log);
            thread.updatePosts(post._id, console.log);
          }
          else {
            req.flash('error', 'Initial post not saved due to validation error.');
          }
        });
      }
      else {
        req.flash('error', 'Thread was not added to users\'s thread pool due to some error');
      }

    });

    req.flash('info', 'Thread successfully added!');
    res.redirect('/threads/' + thread.slug);

  });

};