// Firebase Cloud Messaging
var admin = require("firebase-admin");

async function sendNotification(registrationToken) {
  var message = {
    notification: {
      title: "Astronomy Guide App",
      body: "New event has been added!",
    },
    token: registrationToken,
  };

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

module.exports = { sendNotification };