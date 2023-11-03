const express = require("express");
const axios = require("axios");
const router = express.Router();

const CONFIDENTIAL_WEATHER_API_KEY = "29af4c07ebdd4189a0b222326232410";

async function fetchNearbyObservatoryFromAPIs(radius, days) {
    const client_ip = "184.68.183.186"; // hardcoded for testing purpose, TODO: need to replace with req.ip in the future
      try {
        const response = await axios.get(`https://ipinfo.io/${client_ip}/json`); // api to get geolocation of the client based on their ip,
        const geolocationData = response.data;
        const lat = geolocationData.loc.split(",")[0];
        const lon = geolocationData.loc.split(",")[1];

        const nearby_observatory_list = await fetchNearbyObservatoriesList(lat, lon, radius);
        const ObservatoriesWithConditionInfo = await fetchObservatoriesWithConditionInfo(nearby_observatory_list, days);
        return ObservatoriesWithConditionInfo;
      } catch (error) {
        console.error("Error processing fetchNearbyObservatoryFromAPIs:", error);
      }
}

router.post("/", (req, res) => {
  res.send(
    "This post request should return a list of observatory places with corresponding weather and air quality conditions."
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

// Only using 00:00, 06:00, 12:00, and 18:00 weather conditions of the day
function markWeatherForecast(weatherForecast) {
  const filteredForecast = [];

  for (const forecast of weatherForecast) {
    const date = forecast.date;

    let condition_score = 3;
