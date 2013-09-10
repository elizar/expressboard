/*
 * GET home page.
 */
'use strict';
exports.get = function (req, res) {
  if (req.user) {
    res.redirect('/threads');
  }
  res.render('index', {
    title: 'Home',
    user: req.user || null,
    url: req.url,
    errorFlash: req.flash('error'),
    successFlash: req.flash('info')
  });
};
exports.notfound = function (req, res) {
  res.render('notfound', {
    title: 'Not Found!'
  });
};