const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;


module.exports = class MotdHelper {
  constructor() { }

  async connect() {
    this.client = new MongoClient('mongodb://mongo:27017', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    try {
      await this.client.connect();
      this.motds = this.client.db('app').collection('motds');
      return Promise.resolve(this.motds);
    } catch (e) {
      console.error(e);
    }
  }

  async create(motd) {
    if (this.client.isConnected) {
      return this.motds.insertOne({
        message : motd.message,
        foreground : motd.foreground,
        background : motd.background,
        timestamp : motd.timestamp
      });
    } else {
      throw PromiseRejectionEvent;
    }
  }

  async remove(id) {
    if (this.client.isConnected) {
      return this.motds.deleteOne({ _id: mongo.ObjectID(id) });
    } else {
      throw PromiseRejectionEvent;
    }
  }

  async removeAll() {
    if (this.client.isConnected) {
      return this.motds.deleteMany({ });
    } else {
      throw PromiseRejectionEvent;
    }
  }
};
