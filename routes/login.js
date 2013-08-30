var passport = require('passport');
exports.index = function(req,res) {
	res.render('login', {title:'Please Login'})
}
exports.post = function(req,res, next) {
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' })(req, res, next);
}