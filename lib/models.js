/** 
 * Mongoose Schemas & Models
 * Setup all your models and schema here
 **/
'use strict';
var mongoose = require('mongoose');
var models = mongoose.models;
var crypto = require('crypto');
exports.init = function() {
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

  UserSchema.methods.validPassword = function(password) {
    // Hash the password to compare it to a hashed password from DB
    if (this.password !== crypto.createHash('md5').update(password).digest('hex')) {
      return false;
    }
    return true;
  };

  UserSchema.methods.updateThreads = function(tid) {
    models.User.update({
      _id: this._id
    }, {
      $push: {
        threads: tid
      }
    }, console.log);
  };

  UserSchema.methods.updatePosts = function(pid) {
    models.User.update({
      _id: this._id
    }, {
      $push: {
        posts: pid
      }
    }, console.log);
  };

  UserSchema.methods.updatePassword = function(password, callback) {
    models.User.update({
      _id: this._id
    }, {
      $set: {
        password: crypto.createHash('md5').update(password).digest('hex')
      }
    }, callback);
  };

  UserSchema.pre('save', function(next) {
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
      match: /^[a-zA-Z0-9!?\s-:"'%#+&~\(\)_\*\$@]{5,255}$/
    },
    slug: {
      type: String,
      default: ''
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
  ThreadSchema.methods.updatePosts = function(pid) {
    models.Thread.update({
      _id: this._id
    }, {
      $push: {
        posts: pid
      }
    }, console.log);
  };

  ThreadSchema.pre('save', function(next) {
    var self = this;
    var slug = self.title;
    slug = slug.toLowerCase().replace(/\s/g, '-').replace(/[^a-zA-Z0-9\-]+/g, '');
    self.slug = slug;
    next();
    // models.Thread.findOne({slug: slug}, function(err, result) {
    //   if (err || !result) {
    //   }
    // });
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

  PostSchema.path('message').validate(function(val) {
    return val.match(/<[\s"=a-zA-Z>]+.+<+[\/\s]+[a-zA-Z0-9\s]+>*/g) ? false : true;
  }, 'Message should not contain an HTML code use Markdown Instead');

  mongoose.model('Post', PostSchema);

  return mongoose.models;
};
