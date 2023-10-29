const express = require("express");
const app = express();
const port = 8081;

// const { MongoClient } = require("mongodb");
// const uri = "mongodb://localhost:27017";
// const client = new MongoClient(uri);

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

// app.post("/scheduling/:id/events", async (req, res) => {
//   try {
//     const { id } = req.params;
//     req.body.id = Number(id);
//     console.log(req.body);

//     await client.db("astronomy").collection("events").insertOne(req.body);
//     res.status(200).send("Event added successfully\n");
//   } catch (err) {
//     console.log(err);
//     res.send(400).send(err);
//   }
// });

// async function run() {
//   try {
//     await client.connect();
//     console.log("Successfully connected to the database");
//   } catch (err) {
//     console.log(err);
//     await client.close();
//   }
// }

// run();

// app.post("scheduling/:id/events", async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log(id);
//     console.log(req.body);
//     await client.db("astronomy").collection("events").insertOne(req.body);
//     res.status(200).send("Event added successfully\n");
//   } catch (err) {
//     console.log(err);
//     res.send(400).send(err);
//   }
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// module.exports = {
//   client, // Export the MongoDB client
// };
