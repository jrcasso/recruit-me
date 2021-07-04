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
      this.auths = this.client.db('app').collection('auths');
      return Promise.resolve(this.auths);
    } catch (e) {
      console.error(e);
    }
  }

  async create(user) {
    return this.auths.insertOne({
      created : Date.now(),
      expiry : Date.now() + 300000,
    });
  }

  async retrieve(id) {
    if (this.client.isConnected) {
      return this.auths.findOne({ _id: id });
    } else {
      throw PromiseRejectionEvent;
    }
  }

  async remove(id) {
    if (this.client.isConnected) {
      return this.auths.deleteOne({ _id: mongo.ObjectID(id) });
    } else {
      throw PromiseRejectionEvent;
    }
  }

  async removeAll() {
    if (this.client.isConnected) {
      return this.auths.deleteMany({ });
    } else {
      throw PromiseRejectionEvent;
    }
  }
};
