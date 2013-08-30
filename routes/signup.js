/*
* Get Signup
*/

var mongoose = require('mongoose'),
    models = mongoose.models;

exports.get = function(req, res) {
	res.render('signup', {title: 'Signup'});
}
exports.post = function(req, res) {
  var u = new models.User(req.body);
  u.save(function(err, user) {
    if (err) return err;
    res.end(JSON.stringify(user));
  })
}
