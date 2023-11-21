const app = require("./app");

const http = require("http");
const https = require("https");
const fs = require("fs");

const port = 8081;

const server = http.createServer(app);

// Firebase
var admin = require("firebase-admin");
var serviceAccount = require("./fcm.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// FOR LOCAL TESTING, USE THIS HTTP SERVER
server.listen(port, async () => {
  console.log(`HTTP server listening on port ${port}`);
});

// FOR VM TESTING, USE THIS HTTPS SERVER
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
//   });
