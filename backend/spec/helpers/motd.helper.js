const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;


module.exports = class DatabaseHelper {
  constructor() { }

  async connect() {
    this.database = new MongoClient(
      'mongodb://mongo:27017', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
    return this.database.connect((err, client) => {
      if (err) throw err;
      this.database = client.db("app");
      this.motds = this.database.collection("motds")
    });
  }

  async clean() {
    return this.motd.deleteMany({ })
  }

  async create(motd) {
    return this.motds.insertOne({
      message : motd.message,
      foreground : motd.foreground,
      background : motd.background,
      timestamp : motd.timestamp
    });
  }

  async remove(id) {
    return this.motds.deleteOne({ _id: mongo.ObjectID(id) });
  }
}
