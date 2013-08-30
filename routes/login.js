var passport = require('passport');
exports.get = function(req,res) {
  if (req.user) {
    res.redirect('/');
    return;
  }
	res.render('login', {title:'Please Login'})
}
exports.post = function(req,res, next) {
  if (req.user) {
    res.redirect('/');
    return;
  }
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' })(req, res, next);
}