jest.mock("../routes/dbconn");

const app = require("../app");
const request = require("supertest");

const { connectDB } = require("../routes/dbconn");
const { recommendationRequestHandler } = require("../routes/recommendations");
describe('recommendationRequestHandler', () => {
  connectDB
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false);

 test("Test server connection", () => {
     return request(app).get("/").expect(200);
   });

 test('should cause error since test ip is invalid', async () => {
     const userid = '6';
     const days = '10';
     const testIP = "";
     const req_body = {
         mockTesting: true,
         params: { userid, days },
         ip: testIP,
         };
     const response = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
     expect(response.status).toBe(500);
  });

 test('should return a recommendation list on successful execution', async () => {
    const userid = '6';
    const days = '10';
    const testIP = "207.216.11.9";
    const timezone = new Intl.DateTimeFormat('en-CA').resolvedOptions().timeZone;
    console.log("timezone in test: ", timezone)
    const req_body = {
        mockTesting: true,
        params: { userid, days },
        ip: testIP,
        };
    const response = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
    expect(response.status).toBe(200);
    expect(response.text).toContain("total_score");
    expect(response.text).toContain("name");
    expect(response.text).toContain("distance");
    expect(response.text).toContain("date");
    expect(response.text).toContain("condition");
 });

 test('should fail since fetchNearbyObservatoryFromAPIs cannot work as expected', async () => {
      const userid = '6';
      const days = '10';
      const testIP = "127.0.0.1";
      const req_body = {
          mockTesting: true,
          params: { userid, days },
          ip: testIP,
          };
      const response = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
      expect(response.status).toBe(500);
      expect(response.text).toContain("Failed to generate recommendation list");
 });

 test('should fail with invalid observatory list', async () => {
     const userid = '8';
     const days = '0';
     const testIP = "207.216.11.9";
     const timezone = new Intl.DateTimeFormat('en-CA').resolvedOptions().timeZone;
     const req_body = {
         mockTesting: true,
         params: { userid, days },
         ip: testIP,
         };
     const response = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
     expect(response.status).toBe(500);
     expect(response.text).toContain("Failed to generate recommendation list");
  });

  test('should fail since user does not exist in the database', async () => {
       const userid = '3';
       const days = '10';
       const testIP = "207.216.11.9";
       const timezone = new Intl.DateTimeFormat('en-CA').resolvedOptions().timeZone;
       const req_body = {
           mockTesting: true,
           params: { userid, days },
           ip: testIP,
           };
       const response = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
       expect(response.status).toBe(404);
       expect(response.text).toBe("User not found.");
    });

    test('should fail since user does not exist in the database', async () => {
           const userid = '6';
           const days = '10';
           const testIP = "207.216.11.9";
           const timezone = new Intl.DateTimeFormat('en-CA').resolvedOptions().timeZone;
           const req_body = {
               mockTesting: true,
               params: { userid, days },
               ip: testIP,
               };
           const response = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
           expect(response.status).toBe(500);
           expect(response.text).toBe("DATABASE REFUSED TO CONNECT.");
        });
});

