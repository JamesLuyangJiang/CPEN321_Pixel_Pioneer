const express = require("express");
const router = express.Router();

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

router.get("/:id/events", (req, res) => {
  const { id } = req.params;
  console.log(id);
  res.send("The specified user id is: " + id);
});

router.post("/:id/events", async (req, res) => {
  try {
    await client.connect();
    console.log("Successfully connected to the database");
    try {
      const { id } = req.params;
      console.log(id);
      req.body.id = id;
      console.log(req.body);
      await client.db("astronomy").collection("events").insertOne(req.body);
      res.status(200).send("Event added successfully\n");
    } catch (err) {
      res.status(400).send(err);
    }
  } catch (err) {
    console.log(err);
    await client.close();
  }
});

// async function run() {
//   try {
//     await client.connect();
//     console.log("Successfully connected to the database");
//   } catch (err) {
//     console.log(err);
//     await client.close();
//   }
// }

module.exports = router;
