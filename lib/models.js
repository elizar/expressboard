/** 
 * Mongoose Schemas & Models
 * Setup all your models and schema here
 **/
'use strict';
var mongoose = require('mongoose');
exports.init = function() {
		/**
		* User Schema & Model
		**/
    var userSchema = mongoose.Schema({
        username: {
            type: String,
            trim: true,
            lowercase: true,
            required: true,
            unique: true,	// no duplicates
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
            match: /^[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ // must be like email@domain.com
        }
    });

    userSchema.methods.validPassword = function(password) {
        if (this.password !== password) { return false; }
        return true;
    };

    mongoose.model('User', userSchema);

    return mongoose.models;
};
