// Firebase Cloud Messaging
var admin = require("firebase-admin");

module.exports = {
  sendInviteNotification: async (
    registrationToken,
    eventDate,
    eventName,
    senderEmail
  ) => {
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
  },
};
