const motdModel = require('../../models/motd.model.js');
const mongoose = require( 'mongoose' );

/**
 * motdController.js
 *
 * @description :: Server-side logic for managing motds.
 */

module.exports = class MotdHelper {
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

  async create(motd) {
    var newMotd = new motdModel({
      message : motd.message,
      foreground : motd.foreground,
      background : motd.background,
      timestamp : motd.timestamp
    });
    return await newMotd.save();
  }

  async remove(id) {
    motdModel.findByIdAndRemove(id, function (err, motd) {
      if (err) return console.log(err);
    });
  }
}
