const userModel = require('../../models/user.model.js');
const mongoose = require( 'mongoose' );

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */

module.exports = class UserHelper {
  constructor() {
    mongoose.connect('mongodb://mongo:27017/app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      useFindAndModify: false,
    }, function(err) {
      if(err) console.log(err);
    });
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() { });
  }

  async create(user) {
    var newUser = new userModel({
      email :  user.email,
      password : user.password,
      firstname : user.firstname,
      lastname : user.lastname,
      active : user.active,
      verified : user.verified,
      created : Date.now(),
    });
    return await newUser.save();
  }

  async retrieve(id) {
    return userModel.findOne({_id: id}, function (err, user) {
      return user;
    });
  }

  async remove(id) {
    userModel.findByIdAndRemove(id, function (err, user) {
      if (err) return console.log(err);
    });
  }

  async removeAll() {
    userModel.deleteMany(function (err) {
      if (err) return console.log(err);
    });
  }
}
