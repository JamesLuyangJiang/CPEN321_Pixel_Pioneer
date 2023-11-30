const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const { connectDB, allUserEmails } = require("./dbconn");

module.exports = {
  searchUserEmails: async (req, res) => {
    const isConnected = await connectDB();
    if (isConnected) {
      try {
        console.log("SEARCH ALL USER EMAILS");
        const emails = await allUserEmails();
        console.log(emails);
        res.status(200).send(emails);
      } catch (err) {
        res.status(500).send(err);
      } finally {
        await client.close();
        console.log("Database connection closed");
      }
    } else {
      res.status(500).send("Database not connected");
    }
  },
};
