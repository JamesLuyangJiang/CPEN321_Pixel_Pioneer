jest.mock("../routes/dbconn");

const app = require("../app");
const request = require("supertest");

const { connectDB } = require("../routes/dbconn");

// GET https://pixelpioneer.canadacentral.cloudapp.azure.com:8081/scheduling/:id/events
describe("GET a list of events", () => {
  connectDB
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true);

  test("Test server connection", () => {
    return request(app).get("/").expect(200);
  });

  test("Database connection for GET", async () => {
    const testID = 1;
    const response = await request(app).get(`/scheduling/${testID}/events`);

    expect(response.status).toBe(400);
    expect(response.text).toBe("Database not connected");
  });

  test("Get an empty list for a valid user but haven't registered any events", async () => {
    const testID = 1;

    const response = await request(app).get(`/scheduling/${testID}/events`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test("Test invalid user trying to retrieve events", async () => {
    const testID = 3;

    const response = await request(app).get(`/scheduling/${testID}/events`);

    expect(response.status).toBe(400);
  });

  test("Simulate GET catch error block when database failed", async () => {
    const testID = 5;

    const response = await request(app).get(`/scheduling/${testID}/events/`);

    expect(response.status).toBe(400);
    expect(response.error.message).toBe(
      "cannot GET /scheduling/5/events/ (400)"
    );
  });
});

// POST https://pixelpioneer.canadacentral.cloudapp.azure.com:8081/scheduling/:id/events
describe("Testing POST handler to register an event for a user", () => {
  connectDB
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true);

  test("Database connection for POST", async () => {
    const testID = 3;
    const response = await request(app).post(`/scheduling/${testID}/events`);

    expect(response.status).toBe(400);
    expect(response.text).toBe("Database not connected");
  });

  test("Register an event for an invalid user", async () => {
    const testID = 3;

    const response = await request(app).post(`/scheduling/${testID}/events`);

    expect(response.status).toBe(400);
    expect(response.text).toBe("FAILED because ID does not exist in database.");
  });

  test("Register an event for a valid user", async () => {
    const testID = 1;

    const response = await request(app).post(`/scheduling/${testID}/events`);

    expect(response.status).toBe(200);
    expect(response.text).toBe("Event added successfully\n");
  });

  test("Simulate POST catch error block when database failed", async () => {
    const testID = 5;

    const response = await request(app).post(`/scheduling/${testID}/events/`);

    expect(response.status).toBe(400);
    expect(response.error.message).toBe(
      "cannot POST /scheduling/5/events/ (400)"
    );
  });
});

// DELETE https://pixelpioneer.canadacentral.cloudapp.azure.com:8081/scheduling/:id/events/delete
describe("Testing DELETE handler to delete an event for a user", () => {
  connectDB
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true);

  test("Database connection for DELETE", async () => {
    const testID = 3;
    const response = await request(app).delete(
      `/scheduling/${testID}/events/delete`
    );

    expect(response.status).toBe(400);
    expect(response.text).toBe("Database not connected");
  });

  test("Delete an event for an invalid user", async () => {
    const testID = 3;

    const response = await request(app).delete(
      `/scheduling/${testID}/events/delete`
    );

    expect(response.status).toBe(400);
    expect(response.text).toBe("FAILED because ID does not exist in database.");
  });

  test("Delete an event for a valid user with an empty list of events", async () => {
    const testID = 1;

    const response = await request(app).delete(
      `/scheduling/${testID}/events/delete`
    );

    expect(response.status).toBe(400);
    expect(response.text).toBe(
      "FAILED because this ID does not have this event in database."
    );
  });

  test("Delete an event for a valid user but an event that's not in his/her list", async () => {
    const testID = 2;

    const req_body = { name: "Spanish Bank" };

    const response = await request(app)
      .delete(`/scheduling/${testID}/events/delete`)
      .send(req_body);

    // console.log(response);
    expect(response.status).toBe(400);
    expect(response.text).toBe(
      "FAILED because this ID does not have this event in database."
    );
  });

  test("Delete an event for a valid user and the event is registered", async () => {
    const testID = 2;

    const req_body = { name: "UBC" };

    const response = await request(app)
      .delete(`/scheduling/${testID}/events/delete`)
      .send(req_body);

    expect(response.status).toBe(200);
    expect(response.text).toBe("Event deleted successfully\n");
  });

  test("Simulate DELETE catch error block when database failed", async () => {
    const testID = 5;

    const response = await request(app).delete(
      `/scheduling/${testID}/events/delete`
    );

    expect(response.status).toBe(400);
    expect(response.error.message).toBe(
      "cannot DELETE /scheduling/5/events/delete (400)"
    );
  });
});
