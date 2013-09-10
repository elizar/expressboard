/**
* Sub router for /threads/
**/
var mongoose  = require('mongoose'),
    models    = mongoose.models,
    _index    = require('./threads/index'),
    _new      = require('./threads/new'),
    _popular  = require('./threads/popular'),
    _single   = require('./threads/single');

exports.getIndex      = _index.get;
exports.getPopular    = _popular.get;
exports.getNewThread  = _new.get;
exports.postNewThread = _new.post;
exports.getSingle     = _single.get;
exports.postSingle    = _single.post;
