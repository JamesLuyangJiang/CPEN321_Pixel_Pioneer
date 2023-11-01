const https = require("https");
const fs = require("fs");

const fcm = require("./routes/fcm");

const express = require("express");
const app = express();
const port = 8081;

const testAppToken =
  "cBc-1l_iQvuKJPqKSMSdJO:APA91bEqjbbmKNQ6MzV69pXccqedzrfGlHa_H18KdgasEiulRHILZ9yIIetoGEOwwnjlak-h8dHsrApXOWuS1NkCBxxbnytbZghniPv21oZvRjiv4FhicscBvsXcq93961r9j-8LuHVB";

// Firebase
var admin = require("firebase-admin");
var serviceAccount = require("./fcm.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const recommendationsRoutes = require("./routes/recommendations");
const schedulingRoutes = require("./routes/events");
const userRoutes = require("./routes/users");

app.use(express.json());
app.use("/recommendations", recommendationsRoutes);
app.use("/scheduling", schedulingRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function run() {
  try {
    await client.connect();
    console.log("Successfully connected to the database");
  } catch (err) {
    console.log(err);
    await client.close();
  }
}

async function retrieveGlobalUserIDCounter() {
  try {
    var global_user_id_counter = await client
      .db("astronomy")
      .collection("globaluseridcounter")
      .find()
      .toArray();
    console.log(typeof global_user_id_counter);
    if (Object.keys(global_user_id_counter).length === 0) {
      console.log("new server");
      await client
        .db("astronomy")
        .collection("globaluseridcounter")
        .insertOne({ count: 1 });
      console.log("started new count at 1...");
    } else {
      console.log("already started counter...");
      const user_id_obj = await client
        .db("astronomy")
        .collection("globaluseridcounter")
        .find()
        .toArray();
      const user_id_final = user_id_obj[0].count;
      console.log(user_id_final);

      // logic for update the next user_id
      // await client
      //   .db("astronomy")
      //   .collection("globaluseridcounter")
      //   .replaceOne({ count: user_id_final }, { count: user_id_final + 1 });
    }
  } catch (err) {
    console.log(err);
  }
}

async function sendNotification(registrationToken) {
  var message = {
    notification: {
      title: "Astronomy Guide App",
      body: "New event has been added!",
    },
    token: registrationToken,
  };

  console.log("STARTED TO SEND NOTIFICATIONS...");

  await admin
    .messaging()
    .send(message)
    .then(async function (response) {
      console.log("Successfully sent with response: ", response);
    })
    .catch(async function (err) {
      console.log("Something went wrong: " + err);
    });
}

// app.listen(port, async () => {
//   console.log(`HTTPS server listening on port ${port}`);
//   run();
//   retrieveGlobalUserIDCounter();
//   sendNotification(testAppToken);
// });

https
  .createServer(
    {
      key: fs.readFileSync("privkey.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(port, async () => {
    console.log(`HTTPS server listening on port ${port}`);
    run();
    retrieveGlobalUserIDCounter();
  });
