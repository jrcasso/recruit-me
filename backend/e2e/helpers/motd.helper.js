const mongo = require('mongodb');

/**
 * motdController.js
 *
 * @description :: Server-side logic for managing motds.
 */

module.exports = class DatabaseHelper {
  constructor() {
    mongo.connect(
      'mongodb://mongo:27017', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },(err, client) => {
      if (err) throw err;
      this.database = client.db("app");
      this.motds = this.database.collection("motds")
    });
  }

  async clean() {
    await this.motd.deleteMany({ })
  }

  async create(motd) {
    return await this.motds.insertOne({
      message : motd.message,
      foreground : motd.foreground,
      background : motd.background,
      timestamp : motd.timestamp
    });
  }

  async remove(id) {
    let payload = { _id: mongo.ObjectID(id) }
    return await this.motds.deleteOne({ _id: mongo.ObjectID(id) });
  }
}
