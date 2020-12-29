const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;


module.exports = class UserHelper {
  constructor() { }

  async connect() {
    this.client = new MongoClient('mongodb://mongo:27017', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    try {
      await this.client.connect();
      this.users = this.client.db('app').collection('users');
      return Promise.resolve(this.users);
    } catch (e) {
      console.error(e);
    }
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
    if (this.client.isConnected) {
      return this.users.findOne({ _id: id });
    } else {
      throw PromiseRejectionEvent;
    }
  }

  async remove(id) {
    if (this.client.isConnected) {
      return this.users.deleteOne({ _id: mongo.ObjectID(id) });
    } else {
      throw PromiseRejectionEvent;
    }
  }

  async removeAll() {
    if (this.client.isConnected) {
      return this.users.deleteMany({ });
    } else {
      throw PromiseRejectionEvent;
    }
  }
};
