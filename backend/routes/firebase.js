// Firebase
var admin = require("firebase-admin");
var serviceAccount = require("../fcm.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = {
  firebaseCloudMessagingHelper: async (message) => {
    return await admin.messaging().send(message);
  },
};
