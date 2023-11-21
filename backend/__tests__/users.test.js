jest.mock("../routes/dbconn");

const app = require("../app");
const request = require("supertest");
const { findUserEmailExists, connectDB } = require("../routes/dbconn");

// POST https://pixelpioneer.canadacentral.cloudapp.azure.com:8081/users/create
describe("Create users", () => {
  connectDB
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true);

  test("Test server connection", () => {
    return request(app).get("/").expect(200);
  });

  test("Database connection for POST", async () => {
    const req_body = {
      email: "testemailnotexists@gmail.com",
      distance: 10,
      notificationToken: "asdfghjkl",
    };
    const response = await request(app).post(`/users/create`).send(req_body);
    expect(response.status).toBe(400);
    expect(response.text).toBe("Database not connected");
  });

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

  test("Successfully update the notification token when user delete and re-download our app", async () => {
    const req_body = {
      email: "harthuang990517@gmail.com",
      distance: 10,
      notificationToken: "qwertyuiop",
    };
    const response = await request(app).post(`/users/create`).send(req_body);

    expect(response.status).toBe(200);
    expect(response.body.notificationToken).toBe("qwertyuiop");
  });

  test("Simulate POST catch error block when database failed", async () => {
    const req_body = {
      email: "invalid@gmail.com",
    };
    const response = await request(app).post("/users/create").send(req_body);

    expect(response.status).toBe(400);
    expect(response.error.message).toBe("cannot POST /users/create (400)");
  });
});

// GET https://pixelpioneer.canadacentral.cloudapp.azure.com:8081/users/get/:userid
describe("Get users profile", () => {
  connectDB
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true);

  test("Database connection for GET", async () => {
    const testID = 6;
    const response = await request(app).get(`/users/get/${testID}`);
    expect(response.status).toBe(400);
    expect(response.text).toBe("Database not connected");
  });

  test("Get valid user profile", async () => {
    const testID = 6;
    const response = await request(app).get(`/users/get/${testID}`);

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe("harthuang990517@gmail.com");
  });

  test("Get invalid user profile", async () => {
    const testID = 3;
    const response = await request(app).get(`/users/get/${testID}`);

    expect(response.status).toBe(404);
    expect(response.text).toBe("User not found");
  });

  test("Simulate GET catch error block when database failed", async () => {
    testID = 8;
    const response = await request(app).get(`/users/get/${testID}`);

    expect(response.status).toBe(400);
    expect(response.error.message).toBe("cannot GET /users/get/8 (400)");
  });
});

// PUT https://pixelpioneer.canadacentral.cloudapp.azure.com:8081/users/update/:userid
describe("Update user profile", () => {
  connectDB
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true);
    
  test("Database connection for PUT", async () => {
    testID = 3;
    const response = await request(app).put(`/users/update/${testID}`);

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
