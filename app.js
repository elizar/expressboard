/**
 * Module dependencies.
 */
'use strict';
var express = require('express'),
  routes = require('./routes'),
  signup = require('./routes/signup'),
  login = require('./routes/login'),
  profile = require('./routes/profile'),
  threads = require('./routes/threads'),
  http = require('http'),
  path = require('path'),
  flash = require('connect-flash'),
  mongoUrl = process.env.MONGOHQ_URL || 'mongodb://localhost/ebdb';

/** DB STUFFS **/
var mongoose = require('mongoose');
mongoose.connect(mongoUrl);
var mongooseModels = require('./lib/models').init(),
  User = mongooseModels.User;

/** PASSPORT STUFFS **/
var passport = require('passport'),
  passportLocal = require('passport-local').Strategy;

/** INIT APP **/
var app = express();

// Setup passport local strategy
// Note: you can check if user is login by checking req.user
// e.g: if(!req.user) res.redirect('/not-login') else res.redirect('/welcome-page')
passport.use(new passportLocal(
  function (username, password, done) {
    User.findOne({
      username: username
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username or password.'
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect username or password.'
        });
      }
      return done(null, user);
    });
  }));

//  Passport won't work without the following two methods 
//  if Session is enabled
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: '9018f21e83ce46f3ea2e3b73e5d75ece75407df7'
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.locals.crypto = require('crypto');
});

app.configure('development', function () {
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

/********************
 *   Routes Galore
 ********************/

// Index routes
app.get('/', routes.get);

// Signup routes
app.get('/signup', signup.get);
app.post('/signup', signup.post);

// Login routes
app.get('/login', login.get);
app.get('/login/password-reset', function (req, res) {
  res.end('Not My Problem!'); // Humour me!
});
app.post('/login', login.post);

// Logout routes
app.get('/logout', function (req, res) {
  req.logout();
  req.flash('info', 'You have successfully logged out!');
  res.redirect('/');
});

// Profile routes
app.get('/profile', profile.get);
app.post('/profile', profile.post);

// Board routes
app.get('/threads', threads.getIndex);
app.get('/threads/popular', threads.getPopular);
app.get('/threads/:thread', threads.getSingle);
app.post('/threads/:thread', threads.postSingle);
app.get('/threads/new', threads.getNewThread);
app.post('/threads/new', threads.postNewThread);

// blitz.io related route
app.get('/mu-39e0351c-3b288830-9fbeae27-30d8ed87', function (req, res) {
  res.end('42');
});

// Catch not found page with wildcard route
app.get('/:notfound', routes.notfound);

/** START HTTP SERVER **/
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
