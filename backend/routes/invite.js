const express = require("express");
const router = express.Router();

router.post("/:userid", async (req, res) => {
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
      res.status(200).send("INVITE USER SUCCESSFUL.");
    }
  }
});

module.exports = router;
