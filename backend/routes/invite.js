const express = require("express");
const router = express.Router();
const notification = require("./notification");

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function manageDB() {
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

router.post("/:userid", async (req, res) => {
  const isConnected = manageDB();
  if (isConnected) {
    try {
      const { userid } = req.params;
      console.log(req.body.name);
      console.log(req.body.receiver);
      // TODO: Check if userid exists, if it exists, find the name and date of the event
      const checkEventExists = await client
        .db("astronomy")
        .collection("events")
        .findOne({ userid: userid, name: req.body.name });
      if (!checkEventExists) {
        res.status(400).send("EVENT NOT FOUND IN DATABASE.");
      } else {
        const eventName = checkEventExists.name;
        const eventDate = checkEventExists.date;
        // TODO: Check if receiver email exists in database
        const checkReceiverEmailExists = await client
          .db("astronomy")
          .collection("users")
          .findOne({ email: req.body.receiver });
        if (!checkReceiverEmailExists) {
          res.status(400).send("INVITED USER NOT FOUND IN DATABASE.");
        } else {
          await client.db("astronomy").collection("events").insertOne({
            userid: checkReceiverEmailExists.userid,
            name: eventName,
            date: eventDate,
          });
          await notification.sendInviteNotification(
            checkReceiverEmailExists.token,
            eventDate,
            eventName
          );
          res.status(200).send("INVITE USER SUCCESSFUL.");
        }
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }
});

module.exports = router;
