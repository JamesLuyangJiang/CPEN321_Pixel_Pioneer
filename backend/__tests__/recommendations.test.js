jest.mock("../routes/dbconn");

const mockAxios = require("axios");
jest.mock("axios");



const app = require("../app");
const request = require("supertest");
const timeout = require('connect-timeout');

const {onSuccessFirstExternalAPI, onSuccessSecondExternalAPI} = require("./mockObject");

const { connectDB } = require("../routes/dbconn");
const { recommendationRequestHandler } = require("../routes/recommendations");

describe('recommendationRequestHandler', () => {
  connectDB
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
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

 test('mock first external API call failed', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error("error!!!!!"));
    const userid = '6';
    const days = '10';
    const testIP = "207.216.11.9";
    const req_body = {
        mockTesting: true,
        params: { userid, days },
        ip: testIP,
        };
    const response = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
    expect(response.status).toBe(500);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    // expect(response.text).toContain("total_score");
    // expect(response.text).toContain("name");
    // expect(response.text).toContain("distance");
    // expect(response.text).toContain("date");
    // expect(response.text).toContain("condition");
 });


 test('should cause error since test ip is invalid', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error("IP IS EMPTY"));
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
     expect(mockAxios.get).toHaveBeenCalledTimes(2);
  });

 test('should return a recommendation list on successful execution', async () => {
    mockAxios.get
        .mockResolvedValueOnce(onSuccessFirstExternalAPI)
        .mockResolvedValueOnce(onSuccessSecondExternalAPI);
    const userid = '6';
    const days = '10';
    const testIP = "207.216.11.9";
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

//  test('should return the same recommendation list within an hour', async () => {
//       const userid = '6';
//       const days = '10';
//       const testIP = "207.216.11.9";
//       const req_body = {
//           mockTesting: true,
//           params: { userid, days },
//           ip: testIP,
//           };
//       const responseFormer = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
//       expect(responseFormer.status).toBe(200);
//       app.use(timeout('120s')); //set waiting time for 120s
//       const responseLatter = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
//       expect(responseLatter.status).toBe(200);
//       expect(responseLatter.text).toEqual(responseFormer.text);
//    });

//  test('should fail since fetchNearbyObservatoryFromAPIs cannot work as expected', async () => {
//       const userid = '6';
//       const days = '10';
//       const testIP = "127.0.0.1";
//       const req_body = {
//           mockTesting: true,
//           params: { userid, days },
//           ip: testIP,
//           };
//       const response = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
//       expect(response.status).toBe(500);
//       expect(response.text).toContain("Failed to generate recommendation list");
//  });

//  test('should fail with invalid observatory list', async () => {
//      const userid = '8';
//      const days = '0';
//      const testIP = "207.216.11.9";
//      const req_body = {
//          mockTesting: true,
//          params: { userid, days },
//          ip: testIP,
//          };
//      const response = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
//      expect(response.status).toBe(500);
//      expect(response.text).toContain("Failed to generate recommendation list");
//   });

//   test('should fail since user does not exist in the database', async () => {
//        const userid = '3';
//        const days = '10';
//        const testIP = "207.216.11.9";
//        const req_body = {
//            mockTesting: true,
//            params: { userid, days },
//            ip: testIP,
//            };
//        const response = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
//        expect(response.status).toBe(404);
//        expect(response.text).toBe("User not found.");
//     });

//     test('should fail since user does not exist in the database', async () => {
//            const userid = '6';
//            const days = '10';
//            const testIP = "207.216.11.9";
//            const req_body = {
//                mockTesting: true,
//                params: { userid, days },
//                ip: testIP,
//                };
//            const response = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
//            expect(response.status).toBe(500);
//            expect(response.text).toBe("DATABASE REFUSED TO CONNECT.");
//         });
});

