const express = require("express");
const router = express.Router();

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

router.get("/:userid", (req, res) => {
  const { userid } = req.params;
  console.log(userid);
  res.send("The specified user id is: " + userid);
});

// router.post("/create", async (req, res) => {
//   try {
//     await client.connect();
//     console.log("Successfully connected to the database");
//     try {
//       console.log(req.body);
//       const user_id = await client.db("astronomy").collection("globaluseridcounter").find()
//       console.log(user_id);
//       user_profile_obj = {

//       }
//     } catch (err) {
//       res.status(400).send(err);
//     }
//   } catch (err) {
//     console.log(err);
//     await client.close();
//   }
// })

router.post("/update/:userid/:username/:email/:distance/:maxnumberofobservatories", async (req, res) => {
  try {
    await client.connect();
    console.log("Successfully connected to the database");
    try {
      const { userid, username, email, distance, maxnumberofobservatories } = req.params;
      console.log(userid, username, email, distance, maxnumberofobservatories);
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
});

module.exports = router;
