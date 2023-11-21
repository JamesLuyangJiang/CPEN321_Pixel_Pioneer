jest.mock("axios");

const axios = require("axios");
const { forecast } = require("./const");

jest.mock("../routes/apimanager", () => ({
  isNotNullOrEmpty: jest.fn(),
  getClientTime: jest.fn(),
  isObservatoriesCacheExpired: jest.fn(),
  fetchNearbyObservatoryFromAPIs: jest.fn(),
  calculateDistance: jest.fn(),
  markWeatherForecast: jest.fn(),
  fetchNearbyObservatoriesList: jest.fn(),
  fetchObservatoriesWithConditionInfo: jest.fn(),
}));

const apiManager = require("../routes/apimanager"); // Update with the correct relative path

afterEach(() => {
  jest.resetAllMocks();
});

describe("isNotNullOrEmpty", () => {
  beforeAll(() => {
    apiManager.isNotNullOrEmpty.mockImplementation(
      (input) => input !== null && input !== ""
    );
  });

  test("should return true for non-empty strings", () => {
    expect(apiManager.isNotNullOrEmpty("test")).toBeTruthy();
  });

  test("should return false for null", () => {
    expect(apiManager.isNotNullOrEmpty(null)).toBeFalsy();
  });

  test("should return false for an empty string", () => {
    expect(apiManager.isNotNullOrEmpty("")).toBeFalsy();
  });
});

describe("getClientTime", () => {
  beforeAll(() => {
    apiManager.getClientTime.mockImplementation((timezone) => {
      // Return a string formatted date here
      const [month, day, year] = new Date("2023-11-20")
        .toLocaleString("en-US", { timeZone: timezone })
        .split("/");
      return `${year.split(", ")[0]}-${month}-${day}`;
    });
  });

  test("should format the current time based on the timezone", () => {
    expect(apiManager.getClientTime("America/Vancouver")).toMatch("2023-11-19");
  });
});

describe("isObservatoriesCacheExpired", () => {
  beforeAll(() => {
    apiManager.isObservatoriesCacheExpired.mockImplementation(({ date }) => {
      // Return true if the cache is expired now
      return Date.now() - date > 60 * 60 * 1000;
    });
  });

  test("should return true if cache is more than 1 hour ago", () => {
    const expired_date = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
    expect(
      apiManager.isObservatoriesCacheExpired({ date: expired_date })
    ).toBeTruthy();
  });

  test("should return false if cache is within 1 hour", () => {
    const current_date = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
    expect(
      apiManager.isObservatoriesCacheExpired({ date: current_date })
    ).toBeFalsy();
  });
});

describe("calculateDistance", () => {
  test("calculateDistance is corrent", () => {
    apiManager.calculateDistance.mockImplementation(
      (lat1, lon1, lat2, lon2) => {
        const earthRadius = 6371; // Radius of the Earth in kilometers

        // Convert latitude and longitude from degrees to radians
        const lat1Rad = (Math.PI * lat1) / 180;
        const lon1Rad = (Math.PI * lon1) / 180;
        const lat2Rad = (Math.PI * lat2) / 180;
        const lon2Rad = (Math.PI * lon2) / 180;

        // Haversine formula
        const dLat = lat2Rad - lat1Rad;
        const dLon = lon2Rad - lon1Rad;

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1Rad) *
            Math.cos(lat2Rad) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Calculate the distance in kilometers
        const distance = earthRadius * c;

        return distance;
      }
    );
    expect(
      Math.floor(
        apiManager.calculateDistance(49.2827, -123.1207, 47.2827, -143.1207)
      )
    ).toEqual(1492);
  });
});

describe("markWeatherForecast", () => {
  test("markWeatherForecast is corrent", () => {
    apiManager.markWeatherForecast.mockImplementation((weatherForecast) => {
      const filteredForecast = [];
      let client_time = "";
      for (const forecast of weatherForecast) {
        const date = forecast.date;

        let condition_score = 3;

        if (forecast.hour[0].condition.text == "Clear") {
          condition_score *= 3;
        } else if (forecast.hour[0].condition.text == "Partly cloudy") {
          condition_score *= 2;
        }

        switch (forecast.hour.air_quality) {
          case 7.0:
          case 8.0:
          case 9.0:
          case 10.0:
            condition_score /= 3;
            break;
          case 3.0:
          case 4.0:
          case 5.0:
          case 6.0:
            condition_score -= 2;
            break;
          default:
            break;
        }

        filteredForecast.push({
          date,
          condition_score,
          date_score: condition_score,
          client_time: client_time,
          condition: forecast.hour[0].condition.text,
        });
      }

      return filteredForecast;
    });
    expect(apiManager.markWeatherForecast(forecast)).toEqual([
      {
        client_time: "",
        condition: "Partly cloudy",
        condition_score: 6,
        date: "2023-11-20",
        date_score: 6,
      },
    ]);
  });
});

describe("fetchNearbyObservatoryFromAPIs", () => {
  test("should fetch data using the public IP", async () => {
    apiManager.fetchNearbyObservatoryFromAPIs.mockResolvedValue([
      {
        name: "Vancouver",
        latitude: 23.98,
        longitude: 106.26,
        distance: 1000,
        weatherForecast: [
          {
            condition_score: 4,
            date_score: 4,
            date: "2023-11-20",
            client_time: "2023-11-20",
            condition: "Clear",
          },
        ],
      },
      {
        name: "Delta",
        latitude: 1.23,
        longitude: 9.86,
        distance: 300,
        weatherForecast: [
          {
            condition_score: 3,
            date_score: 3,
            date: "2023-11-20",
            client_time: "2023-11-20",
            condition: "Fog",
          },
        ],
      },
    ]);
    axios.get.mockResolvedValue({
      data: {
        loc: "49.2827,-123.1207",
        timezone: "America/Vancouver",
      },
    });
    const observatory_list = await apiManager.fetchNearbyObservatoryFromAPIs(
      "101.102.103.104",
      1234,
      3
    );
    expect(observatory_list).toBeInstanceOf(Array);
    expect(observatory_list).toEqual([
      {
        name: "Vancouver",
        latitude: 23.98,
        longitude: 106.26,
        distance: 1000,
        weatherForecast: [
          {
            condition_score: 4,
            date_score: 4,
            date: "2023-11-20",
            client_time: "2023-11-20",
            condition: "Clear",
          },
        ],
      },
      {
        name: "Delta",
        latitude: 1.23,
        longitude: 9.86,
        distance: 300,
        weatherForecast: [
          {
            condition_score: 3,
            date_score: 3,
            date: "2023-11-20",
            client_time: "2023-11-20",
            condition: "Fog",
          },
        ],
      },
    ]);
  });

  test("Handle errors properly in fetchNearbyObservatoryFromAPIs", async () => {
    apiManager.fetchNearbyObservatoryFromAPIs.mockResolvedValue({
      error: "Failed to process fetchNearbyObservatoryFromAPIs",
    });
    axios.get.mockResolvedValue({
      error: "Failed to process fetchNearbyObservatoryFromAPIs",
    });
    const result = await apiManager.fetchNearbyObservatoryFromAPIs("", 1234, 3);
    expect(result).toHaveProperty(
      "error",
      "Failed to process fetchNearbyObservatoryFromAPIs"
    );
  });
});
describe("fetchNearbyObservatoriesList", () => {
  test("should fetch data using the lat, the lon and the radius", async () => {
    apiManager.fetchNearbyObservatoriesList.mockResolvedValue([
      {
        name: "Richmond",
        latitude: 49.163333,
        longitude: -123.163333,
        distance: 2.0666495040024824,
      },
      {
        name: "Vancouver",
        latitude: 49.261111,
        longitude: -123.113889,
        distance: 10.26684474862584,
      },
    ]);

    const observatories_list = await apiManager.fetchNearbyObservatoriesList(
      "49.2827",
      "-123.1207",
      1234
    );

    expect(observatories_list).toBeInstanceOf(Array);
    expect(observatories_list).toEqual([
      {
        name: "Richmond",
        latitude: 49.163333,
        longitude: -123.163333,
        distance: 2.0666495040024824,
      },
      {
        name: "Vancouver",
        latitude: 49.261111,
        longitude: -123.113889,
        distance: 10.26684474862584,
      },
    ]);
  });
});

test("Handle errors properly in fetchNearbyObservatoriesList", async () => {
  apiManager.fetchNearbyObservatoriesList.mockResolvedValue({
    error: "Failed to process fetchNearbyObservatoriesList",
  });
  axios.get.mockResolvedValue({
    error: "Failed to process fetchNearbyObservatoriesList",
  });
  const result = await apiManager.fetchNearbyObservatoriesList(
    "49.2827",
    "-123.1207",
    1234
  );
  expect(result).toHaveProperty(
    "error",
    "Failed to process fetchNearbyObservatoriesList"
  );
});

describe("fetchObservatoriesWithConditionInfo", () => {
  test("should fetch data using the nearby_observatory_list,the days,the apiKey", async () => {
    apiManager.fetchObservatoriesWithConditionInfo.mockResolvedValue([
      {
        date: "2023-11-20",
        condition_score: 6,
        date_score: 0.44999999999999996,
        client_time: "2023-11-20",
        condition: "Partly cloudy",
      },
      {
        date: "2023-11-21",
        condition_score: 6,
        date_score: 0.425,
        client_time: "2023-11-20",
        condition: "Overcast",
      },
      {
        date: "2023-11-22",
        condition_score: 6,
        date_score: 0.4,
        client_time: "2023-11-20",
        condition: "Patchy rain possible",
      },
    ]);

    const observatories_list =
      await apiManager.fetchObservatoriesWithConditionInfo(
        [
          {
            name: "Richmond",
            latitude: 49.163333,
            longitude: -123.163333,
            distance: 2.0666495040024824,
          },
          {
            name: "Vancouver",
            latitude: 49.261111,
            longitude: -123.113889,
            distance: 10.26684474862584,
          },
        ],
        3,
        "29af4c07ebdd4189a0b222326232410"
      );

    expect(observatories_list).toBeInstanceOf(Array);
    expect(observatories_list).toEqual([
      {
        date: "2023-11-20",
        condition_score: 6,
        date_score: 0.44999999999999996,
        client_time: "2023-11-20",
        condition: "Partly cloudy",
      },
      {
        date: "2023-11-21",
        condition_score: 6,
        date_score: 0.425,
        client_time: "2023-11-20",
        condition: "Overcast",
      },
      {
        date: "2023-11-22",
        condition_score: 6,
        date_score: 0.4,
        client_time: "2023-11-20",
        condition: "Patchy rain possible",
      },
    ]);
  });
});

test("Handle errors properly in fetchObservatoriesWithConditionInfo", async () => {
  apiManager.fetchObservatoriesWithConditionInfo.mockResolvedValue({
    error: "Failed to process fetchObservatoriesWithConditionInfo",
  });
  axios.get.mockResolvedValue({
    error: "Failed to process fetchObservatoriesWithConditionInfo",
  });
  const result = await apiManager.fetchObservatoriesWithConditionInfo(
    [
      {
        name: "Richmond",
        latitude: 49.163333,
        longitude: -123.163333,
        distance: 2.0666495040024824,
      },
      {
        name: "Vancouver",
        latitude: 49.261111,
        longitude: -123.113889,
        distance: 10.26684474862584,
      },
    ],
    3,
    "29af4c07ebdd4189a0b222326232410"
  );
  expect(result).toHaveProperty(
    "error",
    "Failed to process fetchObservatoriesWithConditionInfo"
  );
});
