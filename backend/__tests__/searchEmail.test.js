jest.mock("../routes/dbconn");

const app = require("../app");
const request = require("supertest");

const { connectDB, allUserEmails } = require("../routes/dbconn");

describe("test search all active users' emails in database", () => {
  connectDB
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true);

  const resolvedResponse = [
    "testemail1@gmail.com",
    "testemail2@gmail.com",
    "testemail3@gmail.com",
    "testemail4@gmail.com",
  ];

  allUserEmails
    .mockRejectedValueOnce(new Error("ERROR CONNECTING TO USER DATABASE!"))
    .mockResolvedValueOnce(resolvedResponse);

  test("Test server connection", () => {
    return request(app).get("/").expect(200);
  });

  test("Database connection for GET", async () => {
    const response = await request(app).get("/search/allemails");

    expect(response.status).toBe(400);
    expect(response.text).toBe("Database not connected");
  });

  test("User collection return error", async () => {
    const response = await request(app).get("/search/allemails");
    
    expect(response.status).toBe(400);
    expect(response.error.message).toBe("cannot GET /search/allemails (400)");
  });

  test("Successfully retrieved all emails in the user collection", async () => {
    const response = await request(app).get("/search/allemails");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(4);
    expect(response.body).toContain("testemail1@gmail.com");
    expect(response.body).toContain("testemail2@gmail.com");
    expect(response.body).toContain("testemail3@gmail.com");
    expect(response.body).toContain("testemail4@gmail.com");
  });
});
