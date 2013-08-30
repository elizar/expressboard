/*
* Get Signup
*/
var mongoose = require('mongoose');
    User = mongoose.model('User'),

exports.index = function(req, res) {
	res.render('signup', {title: 'Signup'});
}
exports.post = function(req, res) {
  var u = new User(req.body);
  u.save(function(err, user) {
    if (err) return err;
    res.end(JSON.stringify(user));
  })
}
