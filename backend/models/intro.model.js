var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var motdSchema = new Schema({
    message: { type: Topic, required: true },
  }
);

module.exports = mongoose.model('motd', motdSchema);
