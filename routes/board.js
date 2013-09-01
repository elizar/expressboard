'use strict';
var mongoose = require('mongoose'),
    models = mongoose.models,
    hs = require('html-strings'),
    escape = hs.escape,
    unescape = hs.unescape;

exports.get = function(req, res) {
    if (!req.user) {
        res.redirect('/login');
        return;
    }
    // find all threads from current logged in user
    models.Thread.find({owner: req.user._id}, function(err, tr) {
        console.log(tr);
        res.render('boards/board', {
            title: 'Board',
            user: req.user,
            threads: tr,
            errorFlash: req.flash('error'),
            infoFlash: req.flash('info')
        });
    });
    // models.Thread.find().populate('owner').exec(function(err, tr) {
    //     res.render('boards/board', {
    //         title: 'Board',
    //         user: req.user,
    //         threads: tr,
    //         errorFlash: req.flash('error'),
    //         infoFlash: req.flash('info')
    //     });
    // });

};
// Render form for creating new thread
exports.new = function(req, res) {
    if (!req.user) {
        res.redirect('/login');
        return;
    }
    res.render('boards/newform', {
        title: 'Create New Board',
        user: req.user,
        errorFlash: req.flash('error'),
        infoFlash: req.flash('info')
    });
};
// Process form submission
exports.newpost = function(req, res) {
    if (!req.user) {
        res.redirect('/login');
        return;
    }
    var thread = {};
    var title = escape(req.body.title);
    thread.title = title;
    thread.slug = title.toLowerCase().split(' ').join('-');
    thread.owner = req.user._id;
    var t = new models.Thread(thread);

    t.save(function(err, t) {
        if (err) {
            req.flash('error', err);
            res.redirect('/board/new');
            return;
        }
        // Update user's threads sub documents
        req.user.updateThreads(t._id);
        // Setup post data
        var postData = {
            message: escape(req.body.description),
            owner: req.user._id,
            thread: t._id
        };
        var p = new models.Post(postData);
        p.save(function(err, post) {
            if (err) {
                req.flash('error', err);
            }
            // Update user's posts sub documents
            req.user.updatePosts(post._id);
        });
        req.flash('info', 'Thread successfully added!');
        res.redirect('/board');
    });

};
