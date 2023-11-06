// Firebase Cloud Messaging
var admin = require("firebase-admin");

// ChatGPT usage: NO
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ChatGPT usage: NO
async function sendNotification(
  registrationToken,
  dateToNotify,
  astronomy_data
) {
  //  const time_to_live = Number(calculateTTLOnSeconds(dateToNotify));
  await sleep(15000);
  const messageBody =
    "Your scheduled star observation on " +
    dateToNotify +
    ": a sunrise at " +
    astronomy_data.sunrise +
    " and a sunset at " +
    astronomy_data.sunset;
  var message = {
    notification: {
      title: "New event registered!",
      body: messageBody,
    },
    token: registrationToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent with response: ", response);
  } catch (err) {
    console.log("Something went wrong: " + err);
  }
}

// ChatGPT usage: NO
// Using Firebase Cloud Messaging service to send
// real-time push notification to a device identified
// by the registration token when there is an invitation
async function sendInviteNotification(
  registrationToken,
  eventDate,
  eventName,
  senderEmail
) {
  const messageTitle = "You have a new invitation.";
  const messageBody =
    senderEmail +
    " has invited you to join the event at " +
    eventName +
    " on " +
    eventDate;
  var message = {
    notification: {
      title: messageTitle,
      body: messageBody,
    },
    token: registrationToken,
  };
  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent with response: ", response);
  } catch (err) {
    console.log("Something went wrong: " + err);
  }
}

module.exports = { sendNotification, sendInviteNotification };
