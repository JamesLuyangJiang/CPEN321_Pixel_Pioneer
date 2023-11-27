jest.mock("../routes/firebase");

const app = require("../app");
const request = require("supertest");

const { sendInviteNotification } = require("../routes/notification");
const { firebaseCloudMessagingHelper } = require("../routes/firebase");

describe("test send invite notification", () => {
  firebaseCloudMessagingHelper
    .mockRejectedValueOnce(new Error("ERROR!"))
    .mockResolvedValueOnce("TOKEN");

  test("Test server connection", () => {
    return request(app).get("/").expect(200);
  });

  test("send notification return error", async () => {
    var message = {
      notification: {
        title: "TITLE1",
        body: "BODY1",
      },
      token: "INVALID TOKEN",
    };
    const response = await sendInviteNotification(message);
    expect(response).toBe(null);
  });

  test("successfully send notification with valid token", async () => {
    var message = {
      notification: {
        title: "TITLE2",
        body: "BODY2",
      },
      token: "VALID TOKEN",
    };
    const response = await sendInviteNotification(message);
    expect(response.token).toBe("VALID TOKEN");
    expect(response.notification.title).toBe("TITLE2");
    expect(response.notification.body).toBe("BODY2");
  });
});
