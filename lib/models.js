/** 
* MONGOOSE MODELS 
* Setup all your models and schema here
**/
var mongoose = require('mongoose');

exports.init = function() {
  var userSchema = mongoose.Schema({
      username: String,
      password: String,
      email: String
  });
  userSchema.methods.validPassword = function(password) {
      if (this.password !== password) return false;
      return true;
  };

  mongoose.model('User', userSchema);
  return mongoose.models;
}
