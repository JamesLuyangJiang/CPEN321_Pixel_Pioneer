const { MongoClient } = require("mongodb");
const uri = "mongodb://pixelpioneer.canadacentral.cloudapp.azure.com:27017";
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
    return await client
      .db("astronomy")
      .collection("events")
      .insertOne(eventObj);
  },

  findOneAndDeleteOneEvent: async (userID, eventName) => {
    return await client
      .db("astronomy")
      .collection("events")
      .findOneAndDelete({ userid: userID, name: eventName });
  },

  findUserEmailExists: async (email) => {
    return await client
      .db("astronomy")
      .collection("users")
      .findOne({ email: email });
  },

  findEmailAndReplaceUserToken: async (email, newProfile) => {
    return await client.db("astronomy").collection("users").findOneAndReplace(
      {
        email: email,
      },
      newProfile
    );
  },

  createNewUser: async (userID, email, distance, token) => {
    return await client.db("astronomy").collection("users").insertOne({
      userid: userID,
      email: email,
      distance: distance,
      notificationToken: token,
    });
  },

  updateExistingUser: async (userID, updatedProfile) => {
    return await client
      .db("astronomy")
      .collection("users")
      .findOneAndReplace({ userid: userID }, updatedProfile);
  },
};
