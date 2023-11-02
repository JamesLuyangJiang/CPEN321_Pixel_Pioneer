const express = require("express");
const apiManager = require("./apimanager");
const notification = require("./notification");
const router = express.Router();

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

router.get("/:id/events", async (req, res) => {
  try {
    await client.connect();
    console.log("Successfully connected to the database");
    try {
      const { id } = req.params;
      const responseObj = await client
        .db("astronomy")
        .collection("events")
        .find({ id: Number(id) })
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
      req.body.id = Number(id);
      await client.db("astronomy").collection("events").insertOne(req.body);

      const astronomy_data = await apiManager.fetchAstronomyInfoOnScheduledDate(req.body.name, req.body.date);

      if (req.body.notificationToken && req.body.date) {
        await notification.sendNotification(req.body.notificationToken, req.body.date, astronomy_data);
      }
      res.status(200).send("Event added successfully\n");
    } catch (err) {
      res.status(400).send(err);
    }
  } catch (err) {
    console.log(err);
    await client.close();
  }
});

module.exports = router;
