const app = require("./app");

const http = require("http");
const https = require("https");
const fs = require("fs");

const port = 8081;

const server = http.createServer(app);

// FOR LOCAL TESTING, USE THIS HTTP SERVER
// server.listen(port, async () => {
//   console.log(`HTTP server listening on port ${port}`);
// });

// FOR VM TESTING, USE THIS HTTPS SERVER
https
  .createServer(
    {
      key: fs.readFileSync(
        "/home/azureuser/CPEN321_Pixel_Pioneer/backend/privkey.pem"
      ),
      cert: fs.readFileSync(
        "/home/azureuser/CPEN321_Pixel_Pioneer/backend/cert.pem"
      ),
    },
    app
  )
  .listen(port, async () => {
    console.log(`HTTPS server listening on port ${port}`);
  });
