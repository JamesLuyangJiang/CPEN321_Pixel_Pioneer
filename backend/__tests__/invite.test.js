jest.mock("../routes/dbconn");
jest.mock("../routes/notification");

const app = require("../app");
const request = require("supertest");

const { connectDB, insertOneEvent } = require("../routes/dbconn");

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

  // Inputs: USERID is a valid user id existing in the database
  // Inputs: NAME is the name of the event in string format
	// inputs: RECEIVER is a valid user's email in the database
  // Expected status code: 500
	// Expected behavior: Could not establish connection to database, nothing change
	// Expected output: “Database not connected”
  test("Database connection for POST", async () => {
    const req_body = {
      name: "Event Not Exist",
      receiver: "receivernotindatabase@gmail.com",
    };
    const testID = 2;
    const response = await request(app)
      .post(`/invitation/${testID}`)
      .send(req_body);

    expect(response.status).toBe(500);
    expect(response.text).toBe("Database not connected");
  });

  // Inputs: USERID is a valid user id existing in the database
  // Inputs: NAME is the name of the event in string format
  // inputs: RECEIVER is a valid user's email in the database
	// Expected status code: 404
	// Expected behavior: database did not find this event under this user because this user's registered event list does not contain this event, database is unchanged
	// Expected output: “EVENT NOT FOUND IN DATABASE.”
  test("Event does not exist in the user's database", async () => {
    const req_body = {
      name: "Event Not Exist",
      receiver: "receivernotindatabase@gmail.com",
    };
    const testID = 2;
    const response = await request(app)
      .post(`/invitation/${testID}`)
      .send(req_body);

    expect(response.status).toBe(404);
    expect(response.text).toBe("EVENT NOT FOUND IN DATABASE.");
  });

  // Inputs: USERID is a valid user id existing in the database
  // Inputs: NAME is the name of the event in string format
  // inputs: RECEIVER is an invalid user's email in the database
	// Expected status code: 404
	// Expected behavior: database did not find this user email because this user email does not exist, database is unchanged
	// Expected output: “INVITED USER NOT FOUND IN DATABASE.”
  test("Receiver email does not exist in the user's database", async () => {
    const req_body = {
      name: "UBC",
      receiver: "receivernotindatabase@gmail.com",
    };
    const testID = 2;
    const response = await request(app)
      .post(`/invitation/${testID}`)
      .send(req_body);

    expect(response.status).toBe(404);
    expect(response.text).toBe("INVITED USER NOT FOUND IN DATABASE.");
  });

  // Inputs: USERID is a valid user id existing in the database
  // Inputs: NAME is the name of the event in string format
	// inputs: RECEIVER is a valid user's email in the database
  // Expected status code: 200
  // Expected behavior: The invited user is being notified and a new event has been added to the database.
  // Expected output: "INVITE USER SUCCESSFUL."
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
    expect(response.text).toBe("INVITE USER SUCCESSFUL.");
    expect(insertOneEvent).toHaveBeenCalledTimes(1);
  });

  // Inputs: USERID is a valid user id existing in the database
  // Inputs: NAME is the name of the event in string format
  // inputs: RECEIVER is an invalid user's email in the database
	// Expected status code: 500
	// Expected behavior: Failed to complete CRUD operations in database after establishing connection, database is unchanged
	// Expected output: “cannot POST /invitation/5 (500)”
  test("Simulate POST catch error block when database failed", async () => {
    const req_body = {
      name: "UBC",
      receiver: "hannah@gmail.com",
    };
    const testID = 5;
    const response = await request(app)
      .post(`/invitation/${testID}`)
      .send(req_body);

    expect(response.status).toBe(500);
    expect(response.error.message).toBe("cannot POST /invitation/5 (500)");
  });
});
