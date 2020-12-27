const mongo = require('mongodb');


module.exports = class UserHelper {
  constructor() { }

  async connect() {
    return mongo.connect(
      'mongodb://mongo:27017', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },(err, client) => {
      if (err) throw err;
      this.database = client.db("app");
      this.users = this.database.collection("users")
    });
  }

  async create(user) {
    return this.users.insertOne({
      email :  user.email,
      password : user.password,
      firstname : user.firstname,
      lastname : user.lastname,
      active : user.active,
      verified : user.verified,
      created : Date.now(),
    });
  }

  async retrieve(id) {
    return this.users.findOne({ _id: id });
  }

  async remove(id) {
    return this.users.deleteOne({ _id: mongo.ObjectID(id) });
  }

  async removeAll() {
    return await this.users.deleteMany({ })
  }
}
