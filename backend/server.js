const https = require("https");
const fs = require("fs");

const express = require("express");
const app = express();
const port = 8081;

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
const schedulingRoutes = require("./routes/scheduling");
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

app.listen(port, async () => {
 console.log(`HTTPS server listening on port ${port}`);
 run();
});

 // https
 //   .createServer(
 //     {
 //       key: fs.readFileSync("privkey.pem"),
 //       cert: fs.readFileSync("cert.pem"),
 //     },
 //     app
 //   )
 //   .listen(port, async () => {
 //     console.log(`HTTPS server listening on port ${port}`);
 //     run();
 //   });
