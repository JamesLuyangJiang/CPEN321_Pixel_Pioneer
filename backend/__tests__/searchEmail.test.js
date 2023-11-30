jest.mock("../routes/dbconn");

const app = require("../app");
const request = require("supertest");

const { connectDB, allUserEmails } = require("../routes/dbconn");

// Interface GET https://pixelpioneer.canadacentral.cloudapp.azure.com:8081/search/allemails
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

  // Inputs: NONE
  // Expected status code: 500
	// Expected behavior: Could not establish connection to database, nothing change
	// Expected output: “Database not connected”
  test("Database connection for GET", async () => {
    const response = await request(app).get("/search/allemails");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Database not connected");
  });

  // Inputs: NONE
	// Expected status code: 500
	// Expected behavior: Failed to complete CRUD operations in database after establishing connection, database is unchanged
	// Expected output: “cannot GET /search/allemails (500)”
  test("User collection return error", async () => {
    const response = await request(app).get("/search/allemails");
    
    expect(response.status).toBe(500);
    expect(response.error.message).toBe("cannot GET /search/allemails (500)");
  });

  // Inputs: NONE
  // Expected status code: 200
  // Expected behavior: Found all user emails, nothing changed in database
  // Expected output: A list of emails found from the database
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
