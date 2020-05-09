var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var topicSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    creationDate: { type: Date, default: Date.now} }
);

var welcomeSchema = new Schema({
    professional: {
        firstName: { type: String },
        middleName: { type: String },
        lastName: { type: String },
        title: { type: String },
        headerImageURL: { type: String },
    },
    topics: [ topicSchema ]
});

module.exports = mongoose.model('welcome', welcomeSchema);
