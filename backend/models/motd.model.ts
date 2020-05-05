var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var motdSchema = new Schema({
    message: { type: String, required: true },
    foreground: { type: String, default: '#FFFFFF' },
    background: { type: String, default: '#000000'},
    timestamp: { type: Number, default: Date.now },
  }
);

module.exports = mongoose.model('motd', motdSchema);
