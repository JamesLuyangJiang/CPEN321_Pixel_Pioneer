jest.mock("../routes/dbconn");
jest.mock("../routes/notification");

const app = require("../app");
const request = require("supertest");

const { connectDB } = require("../routes/dbconn");

// POST https://pixelpioneer.canadacentral.cloudapp.azure.com:8081/invitation/:userid
describe("Send invitation to another authenticated user", () => {
  connectDB
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true);

  test("Test server connection", () => {
    return request(app).get("/").expect(200);
  });

  test("Database connection for POST", async () => {
    const req_body = {
      name: "Event Not Exist",
      receiver: "receivernotindatabase@gmail.com",
    };
    const testID = 2;
    const response = await request(app)
      .post(`/invitation/${testID}`)
      .send(req_body);

    expect(response.status).toBe(400);
    expect(response.text).toBe("Database not connected");
  });

  test("Event does not exist in the user's database", async () => {
    const req_body = {
      name: "Event Not Exist",
      receiver: "receivernotindatabase@gmail.com",
    };
    const testID = 2;
    const response = await request(app)
      .post(`/invitation/${testID}`)
      .send(req_body);

    expect(response.status).toBe(400);
    expect(response.text).toBe("EVENT NOT FOUND IN DATABASE.");
  });

  test("Receiver email does not exist in the user's database", async () => {
    const req_body = {
      name: "UBC",
      receiver: "receivernotindatabase@gmail.com",
    };
    const testID = 2;
    const response = await request(app)
      .post(`/invitation/${testID}`)
      .send(req_body);

    expect(response.status).toBe(400);
    expect(response.text).toBe("INVITED USER NOT FOUND IN DATABASE.");
  });

  test("Event successfully added to invited user's registered events", async () => {
    const req_body = {
      name: "UBC",
      receiver: "hannah@gmail.com",
    };
    const testID = 2;
    const response = await request(app)
      .post(`/invitation/${testID}`)
      .send(req_body);

    expect(response.status).toBe(200);
  });

  test("Simulate POST catch error block when database failed", async () => {
    const req_body = {
      name: "UBC",
      receiver: "hannah@gmail.com",
    };
    const testID = 5;
    const response = await request(app)
      .post(`/invitation/${testID}`)
      .send(req_body);

    expect(response.status).toBe(400);
    expect(response.error.message).toBe("cannot POST /invitation/5 (400)");
  });
});
