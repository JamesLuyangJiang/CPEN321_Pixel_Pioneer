// const express = require("express");
// const router = express.Router();
const uuid = require("uuid");
const {
  connectDB,
  findUserEmailExists,
  findEmailAndReplaceUserToken,
  createNewUser,
  checkIDExists,
  updateExistingUser,
} = require("./dbconn");
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

module.exports = {
  // ChatGPT usage: Partial
  // We consulted ChatGPT for the MongoDB CRUD operations
  // instead of reading the documentation
  // because this way is faster
  createProfile: async (req, res) => {
    const isConnected = await connectDB();
    if (isConnected) {
      console.log("HITTING....");
      console.log(req.body);
      try {
        const user_id = uuid.v4();
        var response_obj = {
          userid: user_id,
          message: "Successfully created user profile",
        };
        const checkEmailExists = await findUserEmailExists(req.body.email);
        console.log(checkEmailExists);

        if (checkEmailExists) {
          console.log("This email found in database");
          console.log(req.body.notificationToken);
          const newProfile = {
            userid: checkEmailExists.userid,
            email: checkEmailExists.email,
            distance: checkEmailExists.distance,
            notificationToken: req.body.notificationToken,
          };
          await findEmailAndReplaceUserToken(req.body.email, newProfile);
          res.status(200).send(newProfile);
        } else {
          console.log("HITTING CREATE NEW USER...");
          await createNewUser(
            user_id,
            req.body.email,
            req.body.distance,
            req.body.notificationToken
          );
          res.status(200).send(response_obj);
        }
      } catch (err) {
        res.status(400).send(err);
      } finally {
        if (client) {
          await client.close();
          console.log("Database connection closed");
        }
      }
    }
  },

  // ChatGPT usage: Partial
  // We consulted ChatGPT for the MongoDB CRUD operations
  // instead of reading the documentation
  // because this way is faster
  getProfile: async (req, res) => {
    const isConnected = connectDB();
    if (isConnected) {
      const { userid } = req.params;
      try {
        // Fetch the current user by userid
        const user = await checkIDExists(userid);

        if (!user) {
          res.status(404).send("User not found");
        } else {
          res.status(200).send(user);
        }
      } catch (err) {
        res.status(400).send(err);
      } finally {
        if (client) {
          await client.close();
          console.log("Database connection closed");
        }
      }
    }
  },

  // ChatGPT usage: Partial
  // We consulted ChatGPT for the MongoDB CRUD operations
  // instead of reading the documentation
  // because this way is faster
  updateProfile: async (req, res) => {
    const isConnected = connectDB();
    if (isConnected) {
      try {
        console.log("HITTING UPDATE USERS...");
        const { userid } = req.params;
        console.log(userid);
        console.log(typeof userid);

        const userProfile = await checkIDExists(userid);

        console.log("HITTING CHECK ID EXISTS");
        console.log(userProfile);

        if (!userProfile) {
          res.status(400).send("ID does not exist in database.");
        } else {
          const updatedProfile = {
            userid,
            email: req.body.email,
            distance: req.body.distance,
            notificationToken: req.body.notificationToken,
          };
          console.log("UPDATED PROFILE...");
          console.log(updatedProfile);
          const responseObject = await updateExistingUser(
            userid,
            updatedProfile
          );
          console.log("HITTING UPDATE RESPONSE OBJECT...");
          console.log(responseObject);
          res.status(200).send("User profile updated successfully\n");
        }
      } catch (err) {
        res.status(400).send(err);
      } finally {
        if (client) {
          await client.close();
          console.log("Database connection closed");
        }
      }
    }
  },
};

// router.get("/get/:userid", getProfile);
// router.put("/update/:userid", updateProfile);
// router.post("/create", createProfile);

// module.exports = router;
