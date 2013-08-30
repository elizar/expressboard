/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    signup = require('./routes/signup'),
    login = require('./routes/login'),
    http = require('http'),
    passport = require('passport'),
    local = require('passport-local').Strategy,
    path = require('path'),
    mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/project'),
    models = require('./models');

var User = models.user(mongoose);


var app = express();

passport.use(new local(
    function(username, password, done) {
        User.findOne({
            username: username
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            console.log('user');
            return done(null, user);
        });
    }
));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session({
        secret: 'beepboop'
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});
/* index routes */
app.get('/', routes.index);

/* signup routes */
app.get('/signup', signup.index);
app.post('/signup', signup.post);

/* login routes */
app.get('/login', login.index);
app.post('/login', login.post);


http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
