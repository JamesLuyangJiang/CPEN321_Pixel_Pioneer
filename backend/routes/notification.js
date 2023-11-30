const { firebaseCloudMessagingHelper } = require("./firebase");

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
      const response = await firebaseCloudMessagingHelper(message);
      console.log("Successfully sent with response: ", response);
      return registrationToken;
    } catch (err) {
      console.log("Something went wrong: " + err);
      return null;
    }
  },
};
