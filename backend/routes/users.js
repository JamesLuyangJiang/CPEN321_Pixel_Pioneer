const express = require("express");
const router = express.Router();
const uuid = require("uuid");
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
async function createProfile(req, res) {
  const isConnected = await connectDB();
  if (isConnected) {
    try {
      const user_id = uuid.v4();
      var response_obj = {
        userid: user_id,
        message: "Successfully created user profile",
      };
      const checkEmailExists = await client
        .db("astronomy")
        .collection("users")
        .findOne({ email: req.body.email });

      if (checkEmailExists) {
        console.log("This email found in database");
        console.log(req.body.notificationToken);
        await client.db("astronomy").collection("users").findOneAndReplace(
          {
            email: req.body.email,
          },
          {
            userid: checkEmailExists.userid,
            email: checkEmailExists.email,
            distance: checkEmailExists.distance,
            notificationToken: req.body.notificationToken,
          }
        );
        res.status(200).send(checkEmailExists);
      } else {
        await client.db("astronomy").collection("users").insertOne({
          userid: user_id,
          email: req.body.email,
          distance: req.body.distance,
          notificationToken: req.body.notificationToken,
        });
        res.status(200).send(response_obj);
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
async function getProfile(req, res) {
  const isConnected = connectDB();
  if (isConnected) {
    const { userid } = req.params;
    try {
      // Fetch the current user by userid
      const user = await client
        .db("astronomy")
        .collection("users")
        .findOne({ userid });

      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.status(200).send(user);
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
async function updateProfile(req, res) {
  const isConnected = connectDB();
  if (isConnected) {
    try {
      const { userid } = req.params;
      console.log(userid);
      console.log(typeof userid);

      const checkIDExists = await client
        .db("astronomy")
        .collection("users")
        .findOne({ userid });

      console.log(checkIDExists);

      if (!checkIDExists) {
        res.status(400).send("ID does not exist in database.");
      } else {
        await client.db("astronomy").collection("users").findOneAndReplace(
          { userid },
          {
            userid,
            email: req.body.email,
            distance: req.body.distance,
            notificationToken: req.body.notificationToken,
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
