const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

module.exports = {
  // ChatGPT usage: NO
  connectDB: async () => {
    await client.connect();
    console.log("Successfully connected to the database");
    return true;
  },

  checkIDExists: async (userID) => {
    return await client
      .db("astronomy")
      .collection("users")
      .findOne({ userid: userID });
  },

  findAllEvents: async (userID) => {
    return await client
      .db("astronomy")
      .collection("events")
      .find({ userid: userID })
      .toArray();
  },

  findOneEvent: async (userID, eventName) => {
    return await client
      .db("astronomy")
      .collection("events")
      .findOne({ userid: userID, name: eventName });
  },

  insertOneEvent: async (eventObj) => {
    return await client.db("astronomy").collection("events").insertOne(eventObj);
  },

  findOneAndDeleteOneEvent: async (userID, eventName) => {
    return await client
      .db("astronomy")
      .collection("events")
      .findOneAndDelete({ userid: userID, name: eventName });
  },
};
