var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
    username : { type: String, unique: true, required: true },
    email :  { type: String, unique: true, required: true },
    firstname : String,
    lastname : String,
    created : Date,
    password : String,
    active : Boolean
});

userSchema.statics.findByUsername = async function (username) {
    return await this.findOne({ username: username });;
};

userSchema.statics.findByLogin = async function (login) {
    let user = await this.findOne({ username: login });
    if (!user) {
        user = await this.findOne({ email: login });
    }
    return users;
};

module.exports = mongoose.model('user', userSchema);
