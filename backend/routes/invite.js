const express = require("express");
const router = express.Router();
const notification = require("./notification");

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// ChatGPT usage: NO
// Utility function to connect to our MongoDB database
async function connectDB() {
  await client.connect();
  console.log("Successfully connected to the database");
  return true;
}

// ChatGPT usage: NO
// This interface will add a new event to the invited user
// If this invited user is in our database
async function inviteSpecifiedUser(req, res) {
  const isConnected = connectDB();
  if (isConnected) {
    try {
      const { userid } = req.params;
      console.log(req.body.name);
      console.log(req.body.receiver);

      const eventsCollection = client.db("astronomy").collection("events");
      const usersCollection = client.db("astronomy").collection("users");

      // Check if userid exists, if it exists, find the name and date of the event
      const checkEventExists = await eventsCollection.findOne({
        userid,
        name: req.body.name,
      });
      if (!checkEventExists) {
        res.status(400).send("EVENT NOT FOUND IN DATABASE.");
      }
      const eventName = checkEventExists.name;
      const eventDate = checkEventExists.date;
      // Check if receiver email exists in database
      const checkReceiverEmailExists = await usersCollection.findOne({
        email: req.body.receiver,
      });
      if (!checkReceiverEmailExists) {
        res.status(400).send("INVITED USER NOT FOUND IN DATABASE.");
      }
      const getSenderProfile = await usersCollection.findOne({ userid });
      console.log("PRINT INVITED USER INFO...");
      console.log(checkReceiverEmailExists);
      console.log("PRINT SENDER EMAIL...");
      console.log(getSenderProfile.email);
      await eventsCollection.insertOne({
        userid: checkReceiverEmailExists.userid,
        name: eventName,
        date: eventDate,
      });
      await notification.sendInviteNotification(
        checkReceiverEmailExists.notificationToken,
        eventDate,
        eventName,
        getSenderProfile.email
      );
      return res.status(200).send("INVITE USER SUCCESSFUL.");
    } catch (err) {
      return res.status(400).send(err);
    } finally {
      if (client) {
        await client.close();
        console.log("Database connection closed");
      }
    }
  }
}

router.post("/:userid", inviteSpecifiedUser);

module.exports = router;
