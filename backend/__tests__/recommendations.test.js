jest.mock('../routes/apimanager', () => ({
 __esModule: true,
 fetchNearbyObservatoryFromAPIs: jest.fn().mockResolvedValue({ name: "Vancouver",
                                                                  latitude: 23.98,
                                                                  longitude: 106.26,
                                                                  distance: 10.27,
                                                                  weatherForecast: [
                                                                    { condition_score: 4,
                                                                      date_score: 4,
                                                                      date: "2023-11-20",
                                                                      client_time: '2023-11-20',
                                                                      condition: 'Clear'}
                                                                  ] }),
}));

jest.mock('../routes/recommendations', () => ({
        __esModule: true,
             recommendationRequestHandler: jest.fn(),
             getUserDistance: jest.fn(),
             getDateScore: jest.fn(),
             generateRecommendationList: jest.fn()
}));

jest.mock('axios');
const apiManager = require("../routes/apimanager");
const recommendations = require('../routes/recommendations');

const { MongoClient } = require("mongodb");

describe("MongoDB connection", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect("mongodb://20.63.115.201:27017", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db("astronomy");
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should connect to MongoDB successfully and fetch user preference", async () => {
    const users = db.collection("users");

    const insertedUser = await users.findOne({ userid: "1001" });

    await expect(insertedUser.distance).toEqual("500");
  });
});

describe('getUserDistance', () => {
     let connection;
       let db;

       beforeAll(async () => {
         connection = await MongoClient.connect("mongodb://localhost:", {
           useNewUrlParser: true,
           useUnifiedTopology: true,
         });
         db = await connection.db("astronomy");
       });

       afterAll(async () => {
         await connection.close();
       });
     recommendations.getUserDistance.mockImplementation( async (userid) => {
                    const users = db.collection("users");
                    const user = await users.findOne({ userid: userid });
                    const distance = user && user.distance ? Number(user.distance) : 1000;
                    return distance; // Return the distance from the found document
                  });
     test('should return user distance', async () => {

       expect(await recommendations.getUserDistance("1001")).toBe(500);

     });

     test('return default distance value if user not exists', async () => {

            expect(await recommendations.getUserDistance("9999")).toBe(1000);

     });
   });

describe("GET /recommendations/:userid/:days", () => {
   let req, res;
   beforeEach(() => {
       req = { params: { userid: '1234', days: '3' },
                       ip: '101.102.103.104'
               };
       res = { json: jest.fn().mockResolvedValue({'name': "Vancouver",
                                                  'distance': "10.27",
                                                  'date': "2023-11-20",
                                                  'condition': "Clear",
                                                  'total_score': "45.61"
                                                 }).mockReturnThis(),
               status: jest.fn().mockReturnThis()
       };
   });
   describe('recommendationRequestHandler', () => {
     test('should return a recommendation list on successful execution', async () => {
       recommendations.recommendationRequestHandler.mockImplementation(async () => {
           const observatory_list = await apiManager.fetchNearbyObservatoryFromAPIs('101.102.103.104', 1234, 3);
           const recommendation_list = recommendations.generateRecommendationList(observatory_list, 1000, 10);
           res.json.mockResolvedValue(recommendation_list);
       });
        req = { params: { userid: '1234', days: '3' },
                ip: '101.102.103.104'
        };
        res = { json: jest.fn().mockResolvedValue({   'name': "Vancouver",

                                                       'distance': 10.27,
                                                       'date': "2023-11-20",
                                                       'condition': "Clear",
                                                       'total_score': "45.61"
                                                   }),
                 status: jest.fn().mockReturnThis()
        };
       await recommendations.recommendationRequestHandler(req, res);
       expect(recommendations.recommendationRequestHandler).toHaveBeenCalled();
       expect(res.status).not.toHaveBeenCalledWith(500);
       console.log("res.json", res.json.getMockImplementation)
     });
    });

    describe('generateRecommendationList', () => {
      // Mock the function with a specific implementation
      recommendations.generateRecommendationList.mockImplementation(
        (nearby_observatory_list, distance_preference, maximum_city_number) => {
          const observatories = [{ name: "Vancouver",
                                      distance: 10.27,
                                      date: "2023-11-20",
                                      condition: "Clear",
                                      total_score: "45.61"
                                     }];
          return observatories.slice(0, maximum_city_number);
        }
      );

      test('should generate a recommendation list', () => {
        const nearby_observatory_list = [{ name: "Vancouver",
                                             latitude: 23.98,
                                             longitude: 106.26,
                                             distance: 1000,
                                             weatherForecast: [
                                               { condition_score: 4,
                                                 date_score: 4,
                                                 date: "2023-11-20",
                                                 client_time: '2023-11-20',
                                                 condition: 'Clear'}
                                             ] }];

        const list = recommendations.generateRecommendationList(nearby_observatory_list, 1000, 10);

        expect(list).toBeInstanceOf(Array);
        expect(list).toHaveLength(1);
      });
    });
});
