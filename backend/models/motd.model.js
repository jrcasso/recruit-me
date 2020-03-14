var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var motdSchema = new Schema({
    'message' : String,
    'foreground' : String,
    'background' : String,
    'timestamp' : Number
});

module.exports = mongoose.model('motd', motdSchema);
