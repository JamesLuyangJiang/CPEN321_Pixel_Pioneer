const express = require("express");
const apiManager = require("./apimanager");
const notification = require("./notification");
const router = express.Router();

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

router.get("/:id/events", async (req, res) => {
  try {
    await client.connect();
    console.log("Successfully connected to the database");
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
  } catch (err) {
    console.log(err);
    await client.close();
  }
});

router.post("/:id/events", async (req, res) => {
  try {
    await client.connect();
    console.log("Successfully connected to the database");
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
        event_obj = {
          userid: id,
          name: req.body.name,
          date: req.body.date,
          notificationToken: req.body.notificationToken,
        };
        await client.db("astronomy").collection("events").insertOne(event_obj);

        const astronomy_data =
          await apiManager.fetchAstronomyInfoOnScheduledDate(
            req.body.name,
            req.body.date
          );

        console.log(astronomy_data);

        if (req.body.notificationToken && req.body.date) {
          await notification.sendNotification(
            req.body.notificationToken,
            req.body.date,
            astronomy_data
          );
        }

        res.status(200).send("Event added successfully\n");
      }
    } catch (err) {
      res.status(400).send(err);
    }
  } catch (err) {
    console.log(err);
    await client.close();
  }
});

router.delete("/:id/events/delete", async (req, res) => {
  const isConnected = manageDB();
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
});

module.exports = router;
