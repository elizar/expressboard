'use strict';
var mongoose = require('mongoose'),
    models = mongoose.models,
    hs = require('html-strings'),
    escape = hs.escape,
    unescape = hs.unescape;

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

    var filter = {owner: req.user._id},
        template = 'threads/own_threads';

    if (req.params.page === 'all') {
      filter = {};
      template = 'threads/all_threads';
    }
    // fetch all threads from this user
    models.Thread.find(filter)
    .populate('posts')
    .populate('owner', 'username')
    .exec(function(err, threads) {
      if (!err) {
        // fetch all posts from this user
        models.Post.find(filter)
        .populate('thread')
        .exec(function(err, posts) {
          if (!err) {
            res.render(template, {
              title: 'threads',
              url: req.url,
              user: req.user,
              threads: threads,
              posts: posts,
              errorFlash: req.flash('error'),
              infoFlash: req.flash('info')
            });
          }
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

exports.newpost = function(req, res) {
    if (!req.user) {
        res.redirect('/login');
        return;
    }

    var title = escape(req.body.title),
        threadData = {};
    threadData.title = title;
    threadData.slug = title.toLowerCase().split(' ').join('-');
    threadData.owner = req.user._id;
    var thread = new models.Thread(threadData);

    thread.save(function(err, thread) {
        if (err) {
            req.flash('error', err);
            res.redirect('/threads/new');
            return;
        }


        var postData = {
            message: escape(req.body.description),
            owner: req.user._id,
            thread: thread._id
        };
        var p = new models.Post(postData);
        p.save(function(err, post) {
            // Update users' threads sub documents
            req.user.updateThreads(thread._id);
            // Update user's posts sub documents
            req.user.updatePosts(post._id);
            // Update thread's post sub documents
            thread.updatePosts(post._id);
            // Update post's owner
        });
        req.flash('info', 'Thread successfully added!');
        res.redirect('/threads');
    });

};
