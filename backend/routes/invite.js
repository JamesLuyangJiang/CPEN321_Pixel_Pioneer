const express = require("express");
const router = express.Router();
const notification = require("./notification");

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// ChatGPT usage: NO
// Utility function to connect to our MongoDB database
async function connectDB() {
  try {
    await client.connect();
    console.log("Successfully connected to the database");
    return true;
  } catch (err) {
    console.log(err);
    await client.close();
    return false;
  }
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
      // Check if userid exists, if it exists, find the name and date of the event
      const checkEventExists = await client
        .db("astronomy")
        .collection("events")
        .findOne({ userid: userid, name: req.body.name });
      if (!checkEventExists) {
        res.status(400).send("EVENT NOT FOUND IN DATABASE.");
      } else {
        const eventName = checkEventExists.name;
        const eventDate = checkEventExists.date;
        // Check if receiver email exists in database
        const checkReceiverEmailExists = await client
          .db("astronomy")
          .collection("users")
          .findOne({ email: req.body.receiver });
        if (!checkReceiverEmailExists) {
          res.status(400).send("INVITED USER NOT FOUND IN DATABASE.");
        } else {
          const getSenderProfile = await client
            .db("astronomy")
            .collection("users")
            .findOne({ userid: userid });
          console.log("PRINT INVITED USER INFO...");
          console.log(checkReceiverEmailExists);
          console.log("PRINT SENDER EMAIL...");
          console.log(getSenderProfile.email);
          await client.db("astronomy").collection("events").insertOne({
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
          res.status(200).send("INVITE USER SUCCESSFUL.");
        }
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

router.post("/:userid", inviteSpecifiedUser);

module.exports = router;
