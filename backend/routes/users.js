const express = require("express");
const router = express.Router();
const uuid = require("uuid");
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

async function createProfile(req, res) {
  const isConnected = await manageDB();
  if (isConnected) {
    try {
      const user_id = uuid.v4();
      responseObj = {
        userid: user_id,
        message: "Successfully created user profile",
      };
      const checkEmailExists = await client
        .db("astronomy")
        .collection("users")
        .findOne({ email: req.body.email });

      if (checkEmailExists) {
        console.log("This email found in database");
        await res.status(200).send(checkEmailExists);
      } else {
        await client.db("astronomy").collection("users").insertOne({
          userid: user_id,
          email: req.body.email,
          distance: req.body.distance,
          token: req.body.token,
        });
        res.send(responseObj);
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

async function getProfile(req, res) {
  const { userid } = req.params;
  try {
    // Fetch the current user by userid
    const user = await client
      .db("astronomy")
      .collection("users")
      .findOne({ userid: userid });

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

async function updateProfile(req, res) {
  const isConnected = manageDB();
  if (isConnected) {
    try {
      const { userid } = req.params;
      console.log(userid);
      console.log(typeof userid);

      const checkIDExists = await client
        .db("astronomy")
        .collection("users")
        .findOne({ userid: userid });

      console.log(checkIDExists);

      if (!checkIDExists) {
        res.status(400).send("ID does not exist in database.");
      } else {
        await client.db("astronomy").collection("users").findOneAndReplace(
          { userid: userid },
          {
            userid: userid,
            email: req.body.email,
            distance: req.body.distance,
            token: req.body.token,
          }
        );
        res.status(200).send("User profile updated successfully\n");
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

router.get("/get/:userid", getProfile);
router.put("/update/:userid", updateProfile);
router.post("/create", createProfile);

module.exports = router;
