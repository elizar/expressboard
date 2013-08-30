/*
 * Get Signup
 */
'use strict';
var mongoose = require('mongoose'),
    models = mongoose.models;

exports.get = function(req, res) {
    res.render('signup', {
        title: 'Signup'
    });
};
exports.post = function(req, res) {
    var u = new models.User(req.body);
    u.save(function(err, user) {
			if (err) {
				return res.end(JSON.stringify(err));
			}
			res.end(JSON.stringify(user));
		});
};
