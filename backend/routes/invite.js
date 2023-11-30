const { sendInviteNotification } = require("./notification");
const {
  connectDB,
  insertOneEvent,
  checkIDExists,
  findOneEvent,
  findUserEmailExists,
} = require("./dbconn");

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

module.exports = {
  // ChatGPT usage: NO
  // This interface will add a new event to the invited user
  // If this invited user is in our database
  inviteSpecifiedUser: async (req, res) => {
    const isConnected = connectDB();
    if (isConnected) {
      try {
        const { userid } = req.params;
        console.log(req.body.name);
        console.log(req.body.receiver);
        const checkEventExists = await findOneEvent(userid, req.body.name);
        console.log(checkEventExists);

        if (!checkEventExists) {
          res.status(404).send("EVENT NOT FOUND IN DATABASE.");
        } else {
          const eventName = checkEventExists.name;
          const eventDate = checkEventExists.date;
          // Check if receiver email exists in database
          const checkReceiverEmailExists = await findUserEmailExists(
            req.body.receiver
          );

          if (!checkReceiverEmailExists) {
            res.status(404).send("INVITED USER NOT FOUND IN DATABASE.");
          } else {
            const getSenderProfile = await checkIDExists(userid);
            console.log("PRINT INVITED USER INFO...");
            console.log(checkReceiverEmailExists);
            console.log("PRINT SENDER EMAIL...");
            console.log(getSenderProfile.email);
            const new_event = {
              userid: checkReceiverEmailExists.userid,
              name: eventName,
              date: eventDate,
            };
            await insertOneEvent(new_event);
            const notificationResult = await sendInviteNotification(
              checkReceiverEmailExists.notificationToken,
              eventDate,
              eventName,
              getSenderProfile.email
            );
            console.log(notificationResult);
            return res.status(200).send("INVITE USER SUCCESSFUL.");
          }
        }
      } catch (err) {
        return res.status(500).send(err);
      } finally {
          await client.close();
          console.log("Database connection closed");
      }
    } else {
      res.status(500).send("Database not connected");
    }
  },
};
