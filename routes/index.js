
/*
 * GET home page.
 */
'use strict';
exports.get = function(req, res){
	res.render('index', { title: 'Express', user: req.user || null });
};