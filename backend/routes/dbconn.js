const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// ChatGPT usage: NO
async function connectDB() {
  await client.connect();
  console.log("Successfully connected to the database");
  return true;
}

module.exports.connectDB = connectDB;
