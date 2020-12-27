// import { User } from '../../models/user.model';
import { User } from '../../models/user.model';
const mongoose = require( 'mongoose' );


export class UserHelper {
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

  public create(user) {
    var newUser = new User({
      email :  user.email,
      password : user.password,
      firstname : user.firstname,
      lastname : user.lastname,
      active : user.active,
      verified : user.verified,
      created : Date.now(),
    });
    return newUser.save();
  }

  public retrieve(id) {
    return User.findOne({_id: id}, function (err, user) {
      return user;
    });
  }

  public remove(id) {
    User.findByIdAndRemove(id, function (err, user) {
      if (err) return console.log(err);
    });
  }

  public removeAll() {
    User.deleteMany(function (err) {
      if (err) return console.log(err);
    });
  }
}
