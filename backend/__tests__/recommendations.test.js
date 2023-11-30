jest.mock("../routes/dbconn");

const mockAxios = require("axios");
jest.mock("axios");

const app = require("../app");
const request = require("supertest");
const timeout = require('connect-timeout');

const { 
    onIpInfoAPISuccess,  
    onGeogratisAPISuccess,
    onGeogratisAPISuccessWithSameConditionScore,
    onWeatherAPISuccess,
    onWeatherAPISuccessWithSameConditionScore }
    = require("../routes/__mocks__/mockExternalAPIResults");

const { connectDB } = require("../routes/dbconn");

// Interface
// GET https://pixelpioneer.canadacentral.cloudapp.azure.com:8081/recommendations/:userid/:days
describe('test recommendationRequestHandler interface and get generated recommendation list'
  , () => {
    beforeEach(() => {
          jest.clearAllMocks();
    });

    afterEach(() => {
          jest.clearAllMocks();
    });

    test("Test server connection", () => {
        return request(app).get("/").expect(200);
    });

    // Inputs: USERID is a valid user id existing in the database
    //         DAYS is the recommended date duration selected by the user on the front-end
    //         It is 3 in this test since mocked data has 6 valid date with corresponding weather
    //         TESTIP is a valid public ip for local test only
    // Expected status code: 200
    // Expected behavior: When recommending the best date,
    //                    select the most recent date if the condition scores are equal
    // Expected output: a recommendation json list which contains valid fields
    test('should return a recommendation list on successful execution differentiating date score'
        , async () => {
          connectDB.mockReturnValueOnce(true);
          mockAxios.get
              .mockResolvedValueOnce(onIpInfoAPISuccess)
              .mockResolvedValueOnce(onGeogratisAPISuccessWithSameConditionScore)
              .mockResolvedValueOnce(onWeatherAPISuccessWithSameConditionScore)
              .mockResolvedValueOnce(onWeatherAPISuccessWithSameConditionScore);
          const userid = '6';
          const days = '3';
          const testIP = "207.216.11.9";
          const req_body = {
              mockTesting: true,
              params: { userid, days },
              ip: testIP,
              };
          const response = await request(app).get(`/recommendations/${userid}/${days}`)
                                             .set('X-Forwarded-For', testIP).send(req_body);
          expect(response.status).toBe(200);
          expect(response.text).toContain("total_score");
          expect(response.text).toContain("name");
          expect(response.text).toContain("distance");
          expect(response.text).toContain("date");
          expect(response.text).toContain("condition");
    });

    // Inputs: USERID is a valid user id existing in the database
    //         DAYS is the recommended date duration selected by the user on the front-end
    //         It is 6 in this test since mocked data has 6 valid date with corresponding weather
    //         TESTIP is a valid public ip for local test only
    // Expected status code: 500
    // Expected behavior: The ipinfo API cannot be called properly and throws an exception.
    // Expected output: 'cannot GET /recommendations/6/6 (500)'
    test('mock ipinfo external API call failed', async () => {
        connectDB.mockReturnValueOnce(true);
        mockAxios.get.mockRejectedValueOnce(new Error("ipinfo external API cannot be called"));
        const userid = '6';
        const days = '6';
        const testIP = "207.216.11.9";
        const req_body = {
            mockTesting: true,
            params: { userid, days },
            ip: testIP,
            };
        const response = await request(app).get(`/recommendations/${userid}/${days}`)
                                           .set('X-Forwarded-For', testIP).send(req_body);
        expect(response.status).toBe(500);
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(response.error.message).toBe('cannot GET /recommendations/6/6 (500)');
    });

    // Inputs: USERID is a valid user id existing in the database
    //         DAYS is the recommended date duration selected by the user on the front-end
    //         It is 6 in this test since mocked data has 6 valid date with corresponding weather
    //         TESTIP is empty in this test to mock the invalid ip failure scenario
    // Expected status code: 500
    // Expected behavior: Fail to call ipinfo API with an invalid parameter and throw an exception.
    // Expected output: 'cannot GET /recommendations/6/6 (500)'
    test('should cause error since test ip is invalid', async () => {
        connectDB.mockReturnValueOnce(true);
        mockAxios.get.mockRejectedValueOnce(new Error("IP IS EMPTY"));
         const userid = '6';
         const days = '6';
         const testIP = "";
         const req_body = {
             mockTesting: true,
             params: { userid, days },
             ip: testIP,
             };
         const response = await request(app).get(`/recommendations/${userid}/${days}`)
                                            .set('X-Forwarded-For', testIP).send(req_body);
         expect(response.status).toBe(500);
         expect(mockAxios.get).toHaveBeenCalledTimes(1);
         console.log(response.error)
         expect(response.error.message).toBe('cannot GET /recommendations/6/6 (500)');
    });

    // Inputs: USERID is a valid user id existing in the database
    //         DAYS is the recommended date duration selected by the user on the front-end
    //         It is 6 in this test since mocked data has 6 valid date with corresponding weather
    //         TESTIP is a valid public ip for local test only
    // Expected status code: 500
    // Expected behavior: Fail to fetch nearby observatories list from geogratis API
    // to generate the recommendation list.
    // Expected output: '{"error":"Failed to generate recommendation list"}'
    test('should fail since cannot fetch nearby observatories list from geogratis API'
      , async () => {
        connectDB.mockReturnValueOnce(true);
        mockAxios.get.mockResolvedValueOnce(onIpInfoAPISuccess)
                   .mockResolvedValueOnce(
                    new Error("Error in fetchNearbyObservatoriesList from geogratis external API"));
        const userid = '6';
        const days = '6';
        const testIP = "207.216.11.9";
        const req_body = {
          mockTesting: true,
          params: { userid, days },
          ip: testIP,
          };
        const response = await request(app).get(`/recommendations/${userid}/${days}`)
                                           .set('X-Forwarded-For', testIP).send(req_body);
        expect(response.status).toBe(500);
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(response.text).toBe('{"error":"Failed to generate recommendation list"}');
    });

    // Inputs: USERID is a valid user id existing in the database
    //         DAYS is the recommended date duration selected by the user on the front-end
    //         It is 6 in this test since mocked data has 6 valid date with corresponding weather
    //         TESTIP is a valid public ip for local test only
    // Expected status code: 500
    // Expected behavior: Fail to fetch weather forecast from external weather API
    // to generate the recommendation list.
    // Expected output: '{"error":"Failed to generate recommendation list"}'
    test('should fail since cannot fetch weather forecast from external weather API', async () => {
          connectDB.mockReturnValueOnce(true);
          mockAxios.get.mockResolvedValueOnce(onIpInfoAPISuccess)
                       .mockResolvedValueOnce(onGeogratisAPISuccess)
                       .mockResolvedValueOnce(new Error("Call weather API failed"));;
          const userid = '6';
          const days = '6';
          const testIP = "207.216.11.9";
          const req_body = {
              mockTesting: true,
              params: { userid, days },
              ip: testIP,
              };
          const response = await request(app).get(`/recommendations/${userid}/${days}`)
                                             .set('X-Forwarded-For', testIP).send(req_body);
          expect(response.status).toBe(500);
          expect(mockAxios.get).toHaveBeenCalledTimes(2);
          expect(response.text).toBe('{"error":"Failed to generate recommendation list"}');
    });

    // Inputs: USERID is a valid user id existing in the database
    //         DAYS is the recommended date duration selected by the user on the front-end
    //         It is 0 which will fail to get weather info required to generate recommendation list
    //         TESTIP is a valid public ip for local test only
    // Expected status code: 500
    // Expected behavior: Fail to generate recommendation list without required weather information.
    // Expected output: '{"error":"Failed to generate recommendation list"}'
   test('should fail with invalid observatory list', async () => {
       connectDB.mockReturnValueOnce(true);
       const userid = '6';
       const days = '0';
       const testIP = "207.216.11.9";
       const req_body = {
           mockTesting: true,
           params: { userid, days },
           ip: testIP,
           };
       const response = await request(app).get(`/recommendations/${userid}/${days}`)
                                          .set('X-Forwarded-For', testIP).send(req_body);
       expect(response.status).toBe(500);
       expect(response.text).toBe('{"error":"Failed to generate recommendation list"}');
   });

    // Inputs: USERID is an invalid user id 3 which is non-existing in the database
    //         DAYS is the recommended date duration selected by the user on the front-end
    //         It is 6 in this test since mocked data has 6 valid date with corresponding weather
    //         TESTIP is a valid public ip for local test only
    // Expected status code: 404
    // Expected behavior: Cannot find corresponding user matching the userid in the database.
    // Expected output: "User not found."
    test('should fail since user does not exist in the database', async () => {
        connectDB.mockReturnValueOnce(true);
        const userid = '3';
        const days = '6';
        const testIP = "207.216.11.9";
        const req_body = {
            mockTesting: true,
            params: { userid, days },
            ip: testIP,
         };
        const response = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
        expect(response.status).toBe(404);
        expect(response.text).toBe("User not found.");
    });

    // Inputs: USERID is a valid user id existing in the database
    //         DAYS is the recommended date duration selected by the user on the front-end
    //         It is 6 in this test since mocked data has 6 valid date with corresponding weather
    //         TESTIP is a valid public ip for local test only
    // Expected status code: 500
    // Expected behavior: Cannot connect to the database.
    // Expected output: "DATABASE REFUSED TO CONNECT."
    test('should fail with database connection error', async () => {
        connectDB.mockReturnValueOnce(false);
        const userid = '6';
        const days = '6';
        const testIP = "207.216.11.9";
        const req_body = {
            mockTesting: true,
            params: { userid, days },
            ip: testIP,
        };
        const response = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
        expect(response.status).toBe(500);
        expect(response.text).toBe("DATABASE REFUSED TO CONNECT.");
    });

    // Inputs: USERID is a valid user id existing in the database
    //         DAYS is the recommended date duration selected by the user on the front-end
    //         It is 6 in this test since mocked data has 6 valid date with corresponding weather
    //         TESTIP is a valid public ip for local test only
    // Expected status code: 200
    // Expected behavior: Can generate the recommendation list as expected with valid fields.
    // Expected output: a valid recommendation list with valid fields
    test('should return a recommendation list on successful execution', async () => {
        connectDB.mockReturnValueOnce(true);
        mockAxios.get
        .mockResolvedValueOnce(onIpInfoAPISuccess)
        .mockResolvedValueOnce(onGeogratisAPISuccess)
        .mockResolvedValueOnce(onWeatherAPISuccess)
        .mockResolvedValueOnce(onWeatherAPISuccess)
        .mockResolvedValueOnce(onWeatherAPISuccess);
        const userid = '6';
        const days = '6';
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

    // Inputs: USERID is a valid user id existing in the database
    //         DAYS is the recommended date duration selected by the user on the front-end
    //         It is 6 in this test since mocked data has 6 valid date with corresponding weather
    //         TESTIP is a valid public ip for local test only
    // Expected status code: 200
    // Expected behavior: The recommendation list should not change frequently within 1 hour.
    // Expected output: The same recommendation list for the second try
    // within 1 hour for the same user who haven't uninstalled the app.
    test('should return the same recommendation list within an hour', async () => {
        connectDB.mockReturnValueOnce(true)
        .mockReturnValueOnce(true);
        mockAxios.get
        .mockResolvedValueOnce(onIpInfoAPISuccess)
        .mockResolvedValueOnce(onGeogratisAPISuccess)
        .mockResolvedValueOnce(onWeatherAPISuccess)
        .mockResolvedValueOnce(onWeatherAPISuccess)
        .mockResolvedValueOnce(onWeatherAPISuccess);
        const userid = '6';
        const days = '6';
        const testIP = "207.216.11.9";
        const req_body = {
            mockTesting: true,
            params: { userid, days },
            ip: testIP,
        };
        const responseFormer = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
        expect(responseFormer.status).toBe(200);
        app.use(timeout('120s')); //set waiting time for 120s
        const responseLatter = await request(app).get(`/recommendations/${userid}/${days}`).set('X-Forwarded-For', testIP).send(req_body);
        expect(responseLatter.status).toBe(200);
        expect(responseLatter.text).toEqual(responseFormer.text);
    });
});
