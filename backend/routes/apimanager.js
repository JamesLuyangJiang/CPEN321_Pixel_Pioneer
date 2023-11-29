const axios = require("axios");
const fs = require("fs").promises; // Use promises interface for fs
let observatories_cache = {};
let client_time = "";

// ChatGPT usage: Partial
// Consulated ChatGPT on how to asynchronously read the contents of the file
async function getApiKey() {
  try {
    const data = await fs.readFile("confidential_weather_api_key.txt", { encoding: "utf-8" });
    return data.trim();
  } catch (err) {
    console.error("Error reading API key file:", err);
    throw err; // Rethrow to handle error outside
  }
}

// ChatGPT usage: No
// This function aims to reduce the response time and avoid recommendation list change within a period
//  Check if the cache is older than 1 hour, return true if it is
function isObservatoriesCacheExpired(cacheItem) {
    // Forecast is unlikely to change much within 1 hour except for special conditions
    const expiryDuration = 60 * 60 * 1000; // 1 hour in milliseconds
    return (new Date() - cacheItem.timestamp) > expiryDuration;
}

// ChatGPT usage: No
function isNotNullOrEmpty(str) {
    return str !== null && str !== '';
}

// ChatGPT usage: No
function getClientTime(client_timezone) {
        const currentDate = new Date();
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: client_timezone,
            hour12: false // Use 24-hour format
        };
        // Retrieve the client's local time by obtaining their time zone from the ipinfo API
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const [month, day, year] = formatter.format(currentDate).split('/');
        const formatted_date = `${year}-${month}-${day}`;
        if(!(isNotNullOrEmpty(year) && isNotNullOrEmpty(month) && isNotNullOrEmpty(day))) {
            formatted_date = new Date();
        }
        return formatted_date;
}

// ChatGPT usage: Partial
// Consulated ChatGPT on how to read device's IP
// And how to call external API to convert IP to
// Longitude and latitude info
async function fetchNearbyObservatoryFromAPIs(publicIP, radius, days) {
  const client_ip = publicIP
  const cacheKey = `${publicIP}_${radius}_${days}`;
  if (observatories_cache[cacheKey] && !isObservatoriesCacheExpired(observatories_cache[cacheKey])) {
      return observatories_cache[cacheKey].data;
  }
  try {
    const CONFIDENTIAL_WEATHER_API_KEY = await getApiKey();
    const response = await axios.get(`https://ipinfo.io/${client_ip}/json`); // api to get geolocation of the client based on their ip,
    client_time = getClientTime(response.data.timezone);
    const geolocationData = response.data;
    const lat = geolocationData.loc.split(",")[0];
    const lon = geolocationData.loc.split(",")[1];

    const nearby_observatory_list = await fetchNearbyObservatoriesList(
      lat,
      lon,
      radius
    );
    const observatoriesWithConditionInfo =
      await fetchObservatoriesWithConditionInfo(
        nearby_observatory_list, days, CONFIDENTIAL_WEATHER_API_KEY);
    observatories_cache[cacheKey] = {
            data: observatoriesWithConditionInfo,
            timestamp: client_time
    };
    return observatoriesWithConditionInfo;
  } catch (error) {
    console.log("Error processing fetchNearbyObservatoryFromAPIs:", error);
    return { error: "Failed to process fetchNearbyObservatoryFromAPIs" };
  }
}

// ChatGPT usage: YES
// This helper method is entirely generated by ChatGPT
function calculateDistance(lat1, lon1, lat2, lon2) {
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

// ChatGPT usage: NO
function markWeatherForecast(weatherForecast) {
  const filteredForecast = [];

  for (const forecast of weatherForecast) {
    const date = forecast.date;

    let condition_score = 20;

    switch (forecast.hour[0].condition.text) {
        case "Clear":
            condition_score = 100;
            break;
        case "Partly cloudy":
            condition_score = 85;
            break;
        case "Mist":
            condition_score = 70;
            break;
        case "Patchy rain possible":
        case "Thundery outbreaks possible":
            condition_score = 60;
            break;
        case "Overcast":
        case "Fog":
            condition_score = 45;
            break;
        case "Patchy snow possible":
        case "Patchy sleet possible":
        case "Patchy freezing drizzle possible":
            condition_score = 30;
            break;
        default:
            break;
    }

    filteredForecast.push({
      date,
      condition_score,
      client_time,
      condition: forecast.hour[0].condition.text,
    });
  }

  return filteredForecast;
}

// ChatGPT usage: NO
async function fetchNearbyObservatoriesList(lat, lon, radius) {
    try {
        const list_of_observatories_response = await axios.get(
            `https://geogratis.gc.ca/services/geoname/en/geonames.json?concise=CITY&lat=${lat}&lon=${lon}&radius=${radius}`
          ); // api to get a list of places around the geolocation of the client
        const items = Array.isArray(list_of_observatories_response.data.items) ? list_of_observatories_response.data.items : [];
                return items
                    .map(current_object => ({
                        name: current_object.name,
                        latitude: current_object.latitude,
                        longitude: current_object.longitude,
                        distance: calculateDistance(
                            lat,
                            lon,
                            current_object.latitude,
                            current_object.longitude
                        ),
                    }))
                    .sort((a, b) => a.distance - b.distance)
                    .filter((_, index) => index % 4 === 0 && index < 80);
//        console.log("items.length: ", items.length);
    } catch (error) {
          console.error("Error in fetchNearbyObservatoriesList:", error);
          return { error: "Error in fetchNearbyObservatoriesList: " + error };
    }
}

// ChatGPT usage: Partial
// Consulted ChatGPT on how to utilize Promise.all()
// to increase efficiency when calling external APIs
async function fetchObservatoriesWithConditionInfo(
  nearby_observatory_list,
  days,
  apiKey
) {
  const weatherAPIRequests = nearby_observatory_list.map(async (item) => {
    return axios
      .get(
        `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${item.latitude},${item.longitude}&days=${days}&aqi=no&alerts=no`
      )
      .then((weather_forecast_response) => {
        const weather_data =
          weather_forecast_response.data.forecast.forecastday;
        item.weatherForecast = markWeatherForecast(weather_data);
      })
      .catch((err) => {
        console.error("Call weather API failed...", err);
        item.weatherForecast = [];
      });
  });

  await Promise.all(weatherAPIRequests).catch((error) => {
    console.error("Error processing weatherAPIRequests:", error);
  });
  return nearby_observatory_list;
}

module.exports = {
  fetchNearbyObservatoryFromAPIs
};
