/**
 * Mongoose Schemas & Models
 * Setup all your models and schema here
 **/
'use strict';

var mongoose  = require('mongoose');
var models    = mongoose.models;
var crypto    = require('crypto');

exports.init = function () {
  /**
   * User
   **/
  var UserSchema = mongoose.Schema({
    username: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true, // no duplicates
      match: /^[a-z0-9]{5,20}$/ // numbers and letters only 5-20 chars long
    },
    password: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      match: /^.{6,20}$/ // Must be at 6-20 characters long
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true, // no duplicates
      match: /^[a-z0-9._%\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/ // must be like email@domain.com
    },
    threads: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thread'
    }],
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }]
  });

  UserSchema.methods.validPassword = function (password) {
    // Hash the password to compare it to a hashed password from DB
    if (this.password !== crypto.createHash('md5').update(password).digest('hex')) {
      return false;
    }
    return true;
  };

  UserSchema.methods.updateThreads = function (tid, callback) {
    models.User.update({
      _id: this._id
    }, {
      $push: {
        threads: tid
      }
    }, callback);
  };

  UserSchema.methods.updatePosts = function (pid, callback) {
    models.User.update({
      _id: this._id
    }, {
      $push: {
        posts: pid
      }
    }, callback);
  };

  UserSchema.methods.updatePassword = function (password, callback) {
    models.User.update({
      _id: this._id
    }, {
      $set: {
        password: crypto.createHash('md5').update(password).digest('hex')
      }
    }, callback);
  };

  UserSchema.pre('save', function (next) {
    // Hash password with md5 before saving to DB and digest with hex
    this.password = crypto.createHash('md5').update(this.password).digest('hex');
    next();
  });

  mongoose.model('User', UserSchema);

  /**
   * Thread
   **/
  var ThreadSchema = mongoose.Schema({
    title: {
      type: String,
      require: true,
    },
    slug: {
      type: String,
      default: '',
      unique: true
    },
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  // schema adhoc for updating list of posts
  ThreadSchema.methods.updatePosts = function (pid, callback) {
    models.Thread.update({
      _id: this._id
    }, {
      $push: {
        posts: pid
      }
    }, callback);
  };

  ThreadSchema.path('title').validate(function (val) {
    return val.match(/<[\s"=a-zA-Z>]+.+<+[\/\s]+[a-zA-Z0-9\s]+>*/g) ? false : val.match(/^[a-zA-Z0-9!\.\/?\s-=\+\^:"'%#&~<>\(\)_\*\$@]{5,100}$/) ? true : false;
  }, 'Title should be at least 5 but not more than 100 characters long. Should not contain HTML tags.');

  ThreadSchema.pre('save', function (next) {
    
    var self = this;
    var slug = self.title;
    slug = slug.toLowerCase()
    .replace(/[\s\W]+/g, '-') // removes spaces and none character
    .replace(/\-$/, '') // removes trailing dash
    .replace(/[^a-zA-Z0-9\-]+/g, ''); // only encode alpha numeric chars and dash

    models.Thread.find({slug: new RegExp('^' + slug)}, function (err, results) {

      // Handle slug like a boss! Prevent duplication
      if (!err && results.length > 0) {

        var prefixNumbers = [];
        results.forEach(function (result) {
          var lastChar = parseInt(result.slug.substr(result.slug.length - 1), 10);
          if (!isNaN(lastChar)) prefixNumbers.push(lastChar);
        });

        var prefixNum = prefixNumbers.length > 0 ? Math.max.apply(Math, prefixNumbers) + 1 : 1;
        slug = slug + '-' + prefixNum;

      }

      self.slug = slug;
      next();

    });

  });

  mongoose.model('Thread', ThreadSchema);

  /**
   * Post
   **/
  var PostSchema = mongoose.Schema({
    message: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thread'
    }
  });

  PostSchema.path('message').validate(function (val) {
    return val.length < 10 ? false : val.match(/<[\s"=a-zA-Z>]+.+<+[\/\s]+[a-zA-Z0-9\s]+>*/g) ? false : true;
  }, 'Post should be at least 10 characters long and should not contain HTML code, ');

  mongoose.model('Post', PostSchema);

  return mongoose.models;
};
