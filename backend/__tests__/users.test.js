jest.mock("../routes/dbconn");

const app = require("../app");
const request = require("supertest");
const {
  findUserEmailExists,
  connectDB,
  findEmailAndReplaceUserToken,
} = require("../routes/dbconn");

// Interface POST https://pixelpioneer.canadacentral.cloudapp.azure.com:8081/users/create
describe("Create users", () => {
  connectDB
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true);

  test("Test server connection", () => {
    return request(app).get("/").expect(200);
  });

  // Inputs: email is a valid GOOGLE GMAIL account
  // Inputs: distance is an integer within the maximum distance we could specify (< 1000km)
  // Inputs: notification token is a valid token generated when user enters the app from FCM
  // Expected status code: 500
  // Expected behavior: Could not establish connection to database, nothing change
  // Expected output: “Database not connected”
  test("Database connection for POST failed", async () => {
    const req_body = {
      email: "testemailnotexists@gmail.com",
      distance: 10,
      notificationToken: "asdfghjkl",
    };
    const response = await request(app).post("/users/create").send(req_body);
    expect(response.status).toBe(500);
    expect(response.text).toBe("Database not connected");
  });

  // Inputs: email is a valid GOOGLE GMAIL account
  // Inputs: distance is an integer within the maximum distance we could specify (< 1000km)
  // Inputs: notification token is a valid token generated when user enters the app from FCM
  // Expected status code: 200
  // Expected behavior: A user profile will be created and added to the database
  // Expected output: "Successfully created user profile"
  test("Successfully create a user", async () => {
    const req_body = {
      email: "testemailnotexists@gmail.com",
      distance: 10,
      notificationToken: "asdfghjkl",
    };
    const response = await request(app).post(`/users/create`).send(req_body);

    expect(findUserEmailExists).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(JSON.parse(response.text).message).toBe(
      "Successfully created user profile"
    );
  });

  // Inputs: email is a valid GOOGLE GMAIL account
  // Inputs: distance is an integer within the maximum distance we could specify (< 1000km)
  // Inputs: notification token is a valid token generated when user enters the app from FCM
  // Expected status code: 200
  // Expected behavior: An existing user profile will be modified in the database
  // Expected output: Modified user profile information
  test("Successfully update the notification token when user delete and re-download our app", async () => {
    const req_body = {
      email: "harthuang990517@gmail.com",
      distance: 10,
      notificationToken: "qwertyuiop",
    };
    const response = await request(app).post(`/users/create`).send(req_body);

    expect(response.status).toBe(200);
    expect(response.body.notificationToken).toBe("qwertyuiop");
    expect(findEmailAndReplaceUserToken).toHaveBeenCalledTimes(1);
  });

  // Inputs: email is an invalid GOOGLE GMAIL account
  // Inputs: distance is an integer within the maximum distance we could specify (< 1000km)
  // Inputs: notification token is a valid token generated when user enters the app from FCM
  // Expected status code: 400
  // Expected behavior: Failed to complete CRUD operations in database after establishing connection, database is unchanged
  // Expected output: An error indicating POST request failed
  test("Simulate POST catch error block when database failed", async () => {
    const req_body = {
      email: "invalid@gmail.com",
      distance: 10,
      notificationToken: "qwertyuiop",
    };
    const response = await request(app).post("/users/create").send(req_body);

    expect(response.status).toBe(400);
    expect(response.error.message).toBe("cannot POST /users/create (400)");
  });

  // Inputs: email is an invalid GOOGLE GMAIL account
  // Inputs: distance is empty
  // Inputs: notification token is a valid token generated when user enters the app from FCM
  // Expected status code: 400
  // Expected behavior: Nothing changed in the database.
  // Expected output: BAD REQUEST, one of the required fields is missing.
  test("Adding a new user profile with empty distance field and expect to fail", async () => {
    const req_body = {
      email: "testemailnotexists@gmail.com",
      distance: "",
      notificationToken: "qwertyuiop",
    };
    const response = await request(app).post(`/users/create`).send(req_body);

    expect(response.status).toBe(400);
    expect(response.text).toBe(
      "BAD REQUEST, one of the required fields is missing."
    );
  });
});

// Interface GET https://pixelpioneer.canadacentral.cloudapp.azure.com:8081/users/get/:userid
describe("Get users profile", () => {
  connectDB
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true);

  // Inputs: USERID is a valid user id existing in the database
  // Expected status code: 500
  // Expected behavior: Could not establish connection to database, nothing change
  // Expected output: “Database not connected”
  test("Database connection for GET failed", async () => {
    const testID = 6;
    const response = await request(app).get(`/users/get/${testID}`);
    expect(response.status).toBe(400);
    expect(response.text).toBe("Database not connected");
  });

  // Inputs: USERID is a valid user id existing in the database
  // Expected status code: 200
  // Expected behavior: User profile found in database, nothing changed in database
  // Expected output: User profile from database
  test("Get valid user profile", async () => {
    const testID = 6;
    const response = await request(app).get(`/users/get/${testID}`);

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe("harthuang990517@gmail.com");
  });

  // Inputs: USERID is an invalid user id not existing in the database
  // Expected status code: 404
  // Expected behavior: This user ID does not exist in the database, nothing changed
  // Expected output: User not found
  test("Get invalid user profile", async () => {
    const testID = 3;
    const response = await request(app).get(`/users/get/${testID}`);

    expect(response.status).toBe(404);
    expect(response.text).toBe("User not found");
  });

  // Inputs: USERID is a valid user id exists in the database
  // Expected status code: 500
  // Expected behavior: Failed to complete CRUD operations in database after establishing connection, database is unchanged
  // Expected output: “cannot GET /users/get/8 (500)”
  test("Simulate GET catch error block when database failed", async () => {
    testID = 8;
    const response = await request(app).get(`/users/get/${testID}`);

    expect(response.status).toBe(500);
    expect(response.error.message).toBe("cannot GET /users/get/8 (500)");
  });
});

// Interface PUT https://pixelpioneer.canadacentral.cloudapp.azure.com:8081/users/update/:userid
describe("Update user profile", () => {
  connectDB
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true);

  // Inputs: USERID is a valid user id existing in the database
  // Inputs: email is a valid GOOGLE GMAIL account
  // Inputs: distance is an integer within the maximum distance we could specify (< 1000km)
  // Inputs: notification token is a valid token generated when user enters the app from FCM
  // Expected status code: 500
  // Expected behavior: Could not establish connection to database, nothing change
  // Expected output: “Database not connected”
  test("Database connection for PUT failed", async () => {
    testID = 3;
    const req_body = {
      email: "harthuang990517@gmail.com",
      distance: 10,
      notificationToken: "qwertyuiop",
    };
    const response = await request(app).put(`/users/update/${testID}`).send(req_body);

    expect(response.status).toBe(400);
    expect(response.text).toBe("Database not connected");
  });

  test("Update invalid user profile", async () => {
    testID = 3;
    const response = await request(app).put(`/users/update/${testID}`);

    expect(response.status).toBe(400);
    expect(response.text).toBe("ID does not exist in database.");
  });

  test("Update valid user profile", async () => {
    testID = 1;
    const response = await request(app).put(`/users/update/${testID}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe("User profile updated successfully\n");
  });

  test("Simulate PUT catch error block when database failed", async () => {
    testID = 8;
    const response = await request(app).put(`/users/update/${testID}`);

    expect(response.status).toBe(400);
    expect(response.error.message).toBe("cannot PUT /users/update/8 (400)");
  });
});
