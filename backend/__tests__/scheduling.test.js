jest.mock("../routes/dbconn");

const app = require("../app");
const request = require("supertest");

const { connectDB, checkIDExists, insertOneEvent } = require("../routes/dbconn");

// Interface GET https://pixelpioneer.canadacentral.cloudapp.azure.com:8081/scheduling/:id/events
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
    expect(checkIDExists).toHaveBeenCalledTimes(1);
  });

  test("Test invalid user trying to retrieve events", async () => {
    const testID = 3;

    const response = await request(app).get(`/scheduling/${testID}/events`);

    expect(response.status).toBe(400);
    expect(checkIDExists).toHaveBeenCalledTimes(2);
  });

  test("Simulate GET catch error block when database failed", async () => {
    const testID = 5;

    const response = await request(app).get(`/scheduling/${testID}/events/`);

    expect(response.status).toBe(400);
    expect(response.error.message).toBe(
      "cannot GET /scheduling/5/events/ (400)"
    );
    expect(checkIDExists).toHaveBeenCalledTimes(3);
  });
});

// Interface POST https://pixelpioneer.canadacentral.cloudapp.azure.com:8081/scheduling/:id/events
describe("Testing POST handler to register an event for a user", () => {
  connectDB
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true);

  // Inputs: USERID is a valid user id existing in the database
  // Inputs: NAME is the name of the event in string format
	// inputs: DATE is the date in “yyyy-mm-dd” string format
  // Expected status code: 500
	// Expected behavior: Could not establish connection to database, nothing change
	// Expected output: “Database not connected”
  test("Database connection for POST", async () => {
    const testID = 1;
    const req_body = {
      name: "UBC",
      date: "2023-12-25",
    };
    const response = await request(app).post(`/scheduling/${testID}/events`).send(req_body);

    expect(response.status).toBe(500);
    expect(response.text).toBe("Database not connected");
    expect(checkIDExists).toHaveBeenCalledTimes(3);
  });

  // Inputs: invalid USERID
  // Inputs: NAME is the name of the event in string format
	// inputs: DATE is the date in “yyyy-mm-dd” string format
	// Expected status code: 404
	// Expected behavior: database did not find this USERID, database is unchanged
	// Expected output: “FAILED because ID does not exist in database”
  test("Register an event for an invalid user", async () => {
    const testID = 3;
    const req_body = {
      name: "UBC",
      date: "2023-12-25",
    };

    const response = await request(app).post(`/scheduling/${testID}/events`).send(req_body);

    expect(response.status).toBe(404);
    expect(response.text).toBe("FAILED because ID does not exist in database.");
    expect(checkIDExists).toHaveBeenCalledTimes(4);
  });

  // Inputs: USERID is a valid user id existing in the database
  // Inputs: NAME is the name of the event in string format
	// inputs: DATE is the date in “yyyy-mm-dd” string format
	// Expected status code: 200
	// Expected behavior: Event is added to the database
	// Expected output: “Event added successfully”
  test("Register an event for a valid user", async () => {
    const testID = 1;
    const req_body = {
      name: "UBC",
      date: "2023-12-25",
    };

    const response = await request(app).post(`/scheduling/${testID}/events`).send(req_body);

    expect(response.status).toBe(200);
    expect(response.text).toBe("Event added successfully\n");
    expect(checkIDExists).toHaveBeenCalledTimes(5);
    expect(insertOneEvent).toHaveBeenCalledTimes(1);
  });

  // Inputs: USERID is a valid user id exists in the database
	// Inputs: Name is an empty string
	// Inputs: DATE is the date in “yyyy-mm-dd” string format
	// Expected status code: 400
	// Expected behavior: database is unchanged
	// Expected output: “BAD REQUEST! FAILED because either the event name or event date is empty”
  test("Register an event with empty event name for a valid user", async () => {
    const testID = 1;
    const req_body = {
      name: "",
      date: "2023-12-25",
    };

    const response = await request(app).post(`/scheduling/${testID}/events`).send(req_body);

    expect(response.status).toBe(400);
    expect(response.text).toBe("BAD REQUEST! FAILED because either the event name or event date is empty.");
    expect(checkIDExists).toHaveBeenCalledTimes(6);
    expect(insertOneEvent).toHaveBeenCalledTimes(1);
  });

  // Inputs: USERID is a valid user id exists in the database
	// Inputs: NAME is the name of the event in string format
	// Inputs: DATE is an empty string
	// Expected status code: 400
	// Expected behavior: database is unchanged
	// Expected output: “BAD REQUEST! FAILED because either the event name or event date is empty.”
  test("Register an event with empty event name for a valid user", async () => {
    const testID = 1;
    const req_body = {
      name: "UBC",
      date: "",
    };

    const response = await request(app).post(`/scheduling/${testID}/events`).send(req_body);

    expect(response.status).toBe(400);
    expect(response.text).toBe("BAD REQUEST! FAILED because either the event name or event date is empty.");
    expect(checkIDExists).toHaveBeenCalledTimes(7);
    expect(insertOneEvent).toHaveBeenCalledTimes(1);
  });

  // Inputs: USERID is a valid user id exists in the database
	// Inputs: NAME is the name of the event in string format
	// Inputs: DATE is an empty string
	// Expected status code: 500
	// Expected behavior: Failed to complete CRUD operations in database after establishing connection, database is unchanged
	// Expected output: “cannot POST /scheduling/5/events/ (500)”
  test("Simulate POST catch error block when database failed", async () => {
    const testID = 5;
    const req_body = {
      name: "UBC",
      date: "2023-12-25",
    };

    const response = await request(app).post(`/scheduling/${testID}/events/`).send(req_body);

    expect(response.status).toBe(500);
    expect(response.error.message).toBe(
      "cannot POST /scheduling/5/events/ (500)"
    );
    expect(checkIDExists).toHaveBeenCalledTimes(8);
    expect(insertOneEvent).toHaveBeenCalledTimes(2);
  });
});

// Interface DELETE https://pixelpioneer.canadacentral.cloudapp.azure.com:8081/scheduling/:id/events/delete
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
