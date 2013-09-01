/*
 * GET home page.
 */
'use strict';
exports.get = function(req, res) {
    if (req.user) {
        res.redirect('/board');
    }
    res.render('index', {
        title: 'Home',
        user: req.user || null
    });
};
exports.notfound = function(req, res) {
    res.render('notfound', {
        title: 'Not Found!'
    });
};
