const express = require("express");
const router = express.Router();

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// router.get("/:userid", (req, res) => {
//   const { userid } = req.params;
//   console.log(userid);
//   res.send("The specified user id is: " + userid);
// });

router.get("/:userid", async (req, res) => {
  try {
    await client.connect();
    console.log("Successfully connected to the database");
    const { userid } = req.params;
    try {
      // Fetch the current user by userid
      const user = await client
        .db("astronomy")
        .collection("users")
        .findOne({ userid: Number(userid) });

      if (!user) {
        res.status(404).send("User not found");
      }

      res.status(200).send("The specified user id is: " + user.userid);
    } catch (err) {
      res.status(400).send(err);
    }
  } catch (err) {
    console.log(err);
    await client.close();
  }
});

router.post("/create", async (req, res) => {
  try {
    await client.connect();
    console.log("Successfully connected to the database");
    try {
      console.log(req.body);
      const user_id_obj = await client
        .db("astronomy")
        .collection("globaluseridcounter")
        .find()
        .toArray();
      const user_id = user_id_obj[0].count;
      console.log(user_id);
      user_profile_response = {
        userid: user_id,
        message: "Successfully created user profile",
      };
      await client.db("astronomy").collection("users").insertOne({
        userid: user_id,
        email: req.body.email,
        distance: req.body.distance,
        maxnumberofobservatories: req.body.maxnumberofobservatories,
      });
      // logic for update the next user_id
      await client
        .db("astronomy")
        .collection("globaluseridcounter")
        .replaceOne({ count: user_id }, { count: user_id + 1 });
      console.log("Successfully incremented user id....");
      console.log("Returning this response to user....");
      console.log(user_profile_response);
      res.send(user_profile_response);
    } catch (err) {
      res.status(400).send(err);
    }
  } catch (err) {
    console.log(err);
    await client.close();
  }
});

router.post(
  "/update/:userid/:username/:email/:distance/:maxnumberofobservatories",
  async (req, res) => {
    try {
      await client.connect();
      console.log("Successfully connected to the database");
      try {
        const { userid, username, email, distance, maxnumberofobservatories } =
          req.params;
        console.log(
          userid,
          username,
          email,
          distance,
          maxnumberofobservatories
        );
        // req.body.userid = userid;
        // req.body.username = username;
        // req.body.email = email;
        // req.body.distance = distance;
        // req.body.maxnumberofobservatories = maxnumberofobservatories;

        await client.db("astronomy").collection("users").insertOne(req.body);

        res.status(200).send("User added successfully\n");
      } catch (err) {
        res.status(400).send(err);
      }
    } catch (err) {
      console.log(err);
      await client.close();
    }
  }
);

module.exports = router;
