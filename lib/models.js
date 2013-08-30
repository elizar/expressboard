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
            required: true
        },
        password: {
            type: String,
            trim: true,
            lowercase: true,
            required: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: true,
            match: /^[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
        }
    });

    userSchema.methods.validPassword = function(password) {
        if (this.password !== password) { return false; }
        return true;
    };

    mongoose.model('User', userSchema);
    
    return mongoose.models;
};
