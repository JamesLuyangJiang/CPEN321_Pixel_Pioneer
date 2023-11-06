const express = require("express");
const router = express.Router();

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// ChatGPT usage: NO
async function connectDB() {
  try {
    await client.connect();
    console.log("Successfully connected to the database");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await client.close();
  }
}

// ChatGPT usage: Partial
// We consulted ChatGPT for the MongoDB CRUD operations
// instead of reading the documentation
// because this way is faster
async function getScheduledEvents(req, res) {
  const isConnected = connectDB();
  if (isConnected) {
    try {
      const { id } = req.params;
      const responseObj = await client
        .db("astronomy")
        .collection("events")
        .find({ userid: id })
        .toArray();
      console.log(responseObj);
      res.status(200).send(responseObj);
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

// ChatGPT usage: Partial
// We consulted ChatGPT for the MongoDB CRUD operations
// instead of reading the documentation
// because this way is faster
async function createScheduledEvent(req, res) {
  const isConnected = connectDB();
  if (isConnected) {
    try {
      const { id } = req.params;
      console.log(id);
      const checkIDExists = await client
        .db("astronomy")
        .collection("users")
        .findOne({ userid: id });
      if (!checkIDExists) {
        res.status(400).send("FAILED because ID does not exist in database.");
      } else {
        var event_obj = {
          userid: id,
          name: req.body.name,
          date: req.body.date,
          notificationToken: req.body.notificationToken,
        };
        await client.db("astronomy").collection("events").insertOne(event_obj);

        res.status(200).send("Event added successfully\n");
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

// ChatGPT usage: Partial
// We consulted ChatGPT for the MongoDB CRUD operations
// instead of reading the documentation
// because this way is faster
async function deleteScheduledEvent(req, res) {
  const isConnected = connectDB();
  if (isConnected) {
    try {
      const { id } = req.params;
      console.log(id);
      const checkIDExists = await client
        .db("astronomy")
        .collection("users")
        .findOne({ userid: id });
      console.log(checkIDExists);
      if (!checkIDExists) {
        res.status(400).send("FAILED because ID does not exist in database.");
      } else {
        const checkEventExists = await client
          .db("astronomy")
          .collection("events")
          .findOne({ userid: id, name: req.body.name });
        console.log(checkEventExists);
        if (!checkEventExists) {
          res
            .status(400)
            .send(
              "FAILED because this ID does not have this event in database."
            );
        } else {
          await client
            .db("astronomy")
            .collection("events")
            .findOneAndDelete({ userid: id, name: req.body.name });
          res.status(200).send("Event deleted successfully\n");
        }
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

router.get("/:id/events", getScheduledEvents);
router.post("/:id/events", createScheduledEvent);
router.delete("/:id/events/delete", deleteScheduledEvent);

module.exports = router;
