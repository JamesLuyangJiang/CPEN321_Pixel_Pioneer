const express = require("express");
const axios = require("axios");
const router = express.Router();

const CONFIDENTIAL_WEATHER_API_KEY = "29af4c07ebdd4189a0b222326232410";

router.get("/", async (req, res) => {
  const client_ip = "184.68.183.186"; // hardcoded for testing purpose, TODO: need to replace with req.ip in the future
  try {
    const response = await axios.get(`https://ipinfo.io/${client_ip}/json`); // api to get geolocation of the client based on their ip, TODO: move to api manager later
    const geolocationData = response.data;
    const lat = geolocationData.loc.split(",")[0];
    const lon = geolocationData.loc.split(",")[1];
    try {
      const list_of_cities_response = await axios.get(
        `https://geogratis.gc.ca/services/geoname/en/geonames.json?lat=${lat}&lon=${lon}&radius=100`
      ); // api to get a list of places around the geolocation of the client, TODO: need to move to apimanager in the future
      const actual_data_items = list_of_cities_response.data.items;
      var customized_response_list = []; // the actual json response of this request
      // http://api.weatherapi.com/v1/forecast.json?key=29af4c07ebdd4189a0b222326232410&q=48.8567,2.3508&days=10&aqi=no&alerts=no
      for (let i = 0; i < actual_data_items.length; i++) {
        const currentObject = actual_data_items[i];
        var customized_response = {
          name: currentObject.name,
          latitude: currentObject.latitude,
          longitude: currentObject.longitude,
          distance: calculateDistance(
            lat,
            lon,
            currentObject.latitude,
            currentObject.longitude
          ),
        };
        customized_response_list.push(customized_response);
      }
      sortByDistance(customized_response_list);
      customized_response_list = getFirstTwenty(customized_response_list);
      // try {
      //   const weather_forecast_response = await axios.get(
      //     `http://api.weatherapi.com/v1/forecast.json?key=${CONFIDENTIAL_WEATHER_API_KEY}&q=${currentObject.latitude},${currentObject.longitude}&days=10&aqi=no&alerts=no`
      //   );
      //   const weather_data =
      //     weather_forecast_response.data.forecast.forecastday;
      //   customized_response.weatherForecast =
      //     filterWeatherForecast(weather_data);
      // } catch (error) {
      //   customized_response.weatherForecast = [];
      //   console.error("Call weather API failed...");
      //   continue;
      // }

      // console.log(
      //   `Object Name: ${currentObject.name}, Object Lat: ${currentObject.latitude}, Object Lon: ${currentObject.longitude}, Object Distance: ${currentObject.distance}`
      // );
      // console.log(customized_response_list.length);

      for (let i = 0; i < customized_response_list.length; i++) {
        try {
          const weather_forecast_response = await axios.get(
            `http://api.weatherapi.com/v1/forecast.json?key=${CONFIDENTIAL_WEATHER_API_KEY}&q=${customized_response_list[i].latitude},${customized_response_list[i].longitude}&days=10&aqi=no&alerts=no`
          );
          const weather_data =
            weather_forecast_response.data.forecast.forecastday;
          customized_response_list[i].weatherForecast =
            filterWeatherForecast(weather_data);
        } catch (error) {
          customized_response.weatherForecast = [];
          console.error("Call weather API failed...");
          continue;
        }
      }

      res.json(customized_response_list);
    } catch (error) {
      res.status(500).json({ error: "Unable to retrieve geolocation data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to retrieve geolocation data" });
  }
});

router.post("/", (req, res) => {
  res.send(
    "This post request should return a list of recommended places based on the filters provided by the users."
  );
});

// Acknowledgement: produced by ChatGPT
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

// Acknowledgement: produced by ChatGPT
function sortByDistance(objects) {
  // Use the sort() method to sort the list by the "distance" field
  objects.sort((a, b) => a.distance - b.distance);
}

function filterWeatherForecast(weatherForecast) {
  const filteredForecast = [];

  for (const forecast of weatherForecast) {
    const date = forecast.date;
    var conditions = [];

    conditions.push({
      time: forecast.hour[0].time,
      condition: forecast.hour[0].condition.text,
    });
    conditions.push({
      time: forecast.hour[6].time,
      condition: forecast.hour[6].condition.text,
    });
    conditions.push({
      time: forecast.hour[12].time,
      condition: forecast.hour[12].condition.text,
    });
    conditions.push({
      time: forecast.hour[18].time,
      condition: forecast.hour[18].condition.text,
    });

    filteredForecast.push({ date: date, conditions: conditions });
  }

  return filteredForecast;
}

function getFirstTwenty(list) {
  if (list.length <= 20) {
    return list;
  } else {
    return list.slice(0, 20);
  }
}

module.exports = router;
