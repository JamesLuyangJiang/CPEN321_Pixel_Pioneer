const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const {
  connectDB,
  checkIDExists,
  findAllEvents,
  findOneEvent,
  insertOneEvent,
  findOneAndDeleteOneEvent,
} = require("./dbconn");

module.exports = {
  // ChatGPT usage: Partial
  // We consulted ChatGPT for the MongoDB CRUD operations
  // instead of reading the documentation
  // because this way is faster
  getScheduledEvents: async (req, res) => {
    const isConnected = await connectDB();
    if (isConnected) {
      try {
        const { id } = req.params;
        const userProfile = checkIDExists(id);
        let responseObj;
        if (!userProfile) {
          res.status(404).send("FAILED because ID does not exist in database.");
        } else {
          responseObj = await findAllEvents(id);
          res.status(200).send(responseObj);
        }
      } catch (err) {
        res.status(500).send(err);
      } finally {
        await client.close();
        console.log("Database connection closed");
      }
    } else {
      res.status(400).send("Database not connected");
    }
  },

  // ChatGPT usage: Partial
  // We consulted ChatGPT for the MongoDB CRUD operations
  // instead of reading the documentation
  // because this way is faster
  createScheduledEvent: async (req, res) => {
    const isConnected = await connectDB();
    if (isConnected) {
      try {
        console.log("PRINTING REQ BODY");
        console.log(req.body.name, req.body.date);
        const { id } = req.params;
        const userProfile = await checkIDExists(id);
        if (!userProfile) {
          res.status(404).send("FAILED because ID does not exist in database.");
        } else {
          if (!req.body.name || !req.body.date) {
            res.status(400).send("BAD REQUEST! FAILED because either the event name or event date is empty.")
          } else {
            var event_obj = {
              userid: id,
              name: req.body.name,
              date: req.body.date,
              notificationToken: req.body.notificationToken,
            };
            console.log(event_obj);
            await insertOneEvent(event_obj);
            res.status(200).send("Event added successfully\n");
          }
        }
      } catch (err) {
        res.status(500).send(err);
      } finally {
        await client.close();
        console.log("Database connection closed");
      }
    } else {
      res.status(500).send("Database not connected");
    }
  },

  // ChatGPT usage: Partial
  // We consulted ChatGPT for the MongoDB CRUD operations
  // instead of reading the documentation
  // because this way is faster
  deleteScheduledEvent: async (req, res) => {
    const isConnected = await connectDB();
    if (isConnected) {
      try {
        const { id } = req.params;
        const userProfile = await checkIDExists(id);
        if (!userProfile) {
          res.status(404).send("FAILED because ID does not exist in database.");
        } else {
          const checkEventExists = await findOneEvent(id, req.body.name);
          if (!checkEventExists) {
            res.status(404)
              .send(
                "FAILED because this event does not have this event in database."
              );
          } else {
            await findOneAndDeleteOneEvent(id, req.body.name);
            res.status(200).send("Event deleted successfully\n");
          }
        }
      } catch (err) {
        res.status(500).send(err);
      } finally {
        await client.close();
        console.log("Database connection closed");
      }
    } else {
      res.status(500).send("Database not connected");
    }
  },
};
