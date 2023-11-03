const express = require("express");
const app = express();
// Firebase Cloud Messaging
var admin = require("firebase-admin");
const moment = require("moment");

//// This function is finished with the help of ChatGPT, especially for the usage of "moment"
//function calculateTTLOnSeconds(dateToNotify) {
////    // Parse the "dateToNotify" string into a Date object using moment.js
////    dateToNotifyStr = dateToNotifyStr + " 00:00"
////    const parsedDateToNotify = moment(dateToNotifyStr, 'YYYY-MM-DD HH:mm');
//    // Get the current date and time
//    const currentDateAndTime = moment();
//    // Calculate the time difference in seconds
//    const timeDifferenceInSeconds = dateToNotify.diff(currentDateAndTime, 'seconds');
//    return timeDifferenceInSeconds;
//}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

async function sendInviteNotification(registrationToken, eventDate, eventName) {
  const messageBody =
    "You have been invited to join the event in " +
    eventName +
    " at " +
    eventDate;
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

module.exports = { sendNotification, sendInviteNotification };
