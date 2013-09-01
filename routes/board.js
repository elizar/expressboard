'use strict';
var mongoose = require('mongoose'),
    models = mongoose.models;

exports.get = function(req, res) {
	if (!req.user) {
		res.redirect('/login');
	}
	models.Thread.find().populate('owner').exec(function(err, tr) {
		res.render('boards/board', {title: 'Board', user: req.user, threads: tr });
	});

};
exports.create = function(req, res) {
	if (!req.user) {
		res.redirect('/login');
		return;
	}
	res.render('boards/boardcreate', {title: 'Create New Board', user: req.user});
};

exports.createpost = function(req, res) {
	if (!req.user) {
		res.redirect('/login');
		return;
	}
	var thread = {};
	thread.title = req.body.title;
	thread.owner = req.user._id;
	var t = new models.Thread(thread);

	t.save(function(err, t) {
		if (err) {
		    req.flash('error', err);
		    res.redirect('/board/create');
		    return;
		}
		req.flash('info', 'Thread successfully added!');
		res.redirect('/board');
	});

};