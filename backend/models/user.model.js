var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
  email :  { type: String, unique: true, required: true },
  password : { type: String, required: true },
  firstname : String,
  lastname : String,
  created : Date,
  active : Boolean,
  verified : Boolean
});

userSchema.statics.findByEmail = async function (email) {
  user = await this.findOne({ email: email });
  return user;
};

module.exports = mongoose.model('user', userSchema);
