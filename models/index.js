exports.user = function(mongoose) {
  var userSchema = mongoose.Schema({
      username: String,
      password: String,
      email: String
  });
  userSchema.methods.validPassword = function(password) {
      if (this.password !== password) return false;
      return true;
  };
  return mongoose.model('User', userSchema);
}
