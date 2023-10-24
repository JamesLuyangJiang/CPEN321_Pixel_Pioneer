const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const client_ip = "184.68.183.186";
  try {
    const response = await axios.get(`https://ipinfo.io/${client_ip}/json`);
    const geolocationData = response.data;
    const lat = geolocationData.loc.split(",")[0];
    const lon = geolocationData.loc.split(",")[1];
    try {
      const list_of_cities_response = await axios.get(
        `https://geogratis.gc.ca/services/geoname/en/geonames.json?lat=${lat}&lon=${lon}&radius=100`
      );
      const actual_data_items = list_of_cities_response.data.items;
      var customized_response_list = [];
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
        sortByDistance(customized_response_list)
        console.log(
          `Object Name: ${currentObject.name}, Object Lat: ${currentObject.latitude}, Object Lon: ${currentObject.longitude}, Object Distance: ${currentObject.distance}`
        );
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

function sortByDistance(objects) {
  // Use the sort() method to sort the list by the "distance" field
  objects.sort((a, b) => a.distance - b.distance);
}

module.exports = router;
