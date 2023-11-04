const express = require("express");
const axios = require("axios");
const router = express.Router();

const CONFIDENTIAL_WEATHER_API_KEY = "29af4c07ebdd4189a0b222326232410";

async function fetchNearbyObservatoryFromAPIs(publicIP, radius, days) {
    const client_ip = publicIP;
    console.log(client_ip);
      try {
        const response = await axios.get(`https://ipinfo.io/${client_ip}/json`); // api to get geolocation of the client based on their ip,
        const geolocationData = response.data;
        const lat = geolocationData.loc.split(",")[0];
        const lon = geolocationData.loc.split(",")[1];

        const nearby_observatory_list = await fetchNearbyObservatoriesList(lat, lon, radius);
        const observatoriesWithConditionInfo = await fetchObservatoriesWithConditionInfo(nearby_observatory_list, days);
        return observatoriesWithConditionInfo;
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
    
    if ("Clear" == forecast.hour[0].condition.text) {
        condition_score *= 3;
    }
    else if ("Partly cloudy" == forecast.hour[0].condition.text) {
        condition_score *= 2;
    }

    switch(forecast.hour.air_quality) {
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

    filteredForecast.push({ date: date, condition_score: condition_score, condition: forecast.hour[0].condition.text });
  }

  return filteredForecast;
}

function getTopNObjects(list, n) {
  if (n < 0) {
    n = 0;
  }
  if (list.length <= n) {
    return list;
  } else {
    return list.slice(0, n);
  }
}

async function fetchNearbyObservatoriesList(lat, lon, radius) {

    try {
          const list_of_observatories_response = await axios.get(
            `https://geogratis.gc.ca/services/geoname/en/geonames.json?lat=${lat}&lon=${lon}&radius=${radius}`
          ); // api to get a list of places around the geolocation of the client
          const actual_data_items = list_of_observatories_response.data.items;
          var nearby_observatory_list = []; // the actual json response of this request

          for (let i = 0; i < actual_data_items.length; i++) {
            const currentObject = actual_data_items[i];
            var nearby_observatory = {
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
            nearby_observatory_list.push(nearby_observatory);
          }
          sortByDistance(nearby_observatory_list);
          nearby_observatory_list = getTopNObjects(nearby_observatory_list, 20); // only getting the closest 20 places since the next API call will take a long time
          return nearby_observatory_list;
    } catch (error) {
        nearby_observatory_list = [];
        console.log("Unable to retrieve geolocation data");
    }

}

async function fetchObservatoriesWithConditionInfo(nearby_observatory_list, days) {
    const weatherAPIRequests = nearby_observatory_list.map(async (item) => {
            try {
              const weather_forecast_response = await axios.get(
                `http://api.weatherapi.com/v1/forecast.json?key=${CONFIDENTIAL_WEATHER_API_KEY}&q=${item.latitude},${item.longitude}&days=${days}&aqi=yes&alerts=no`);
              const weather_data =
                weather_forecast_response.data.forecast.forecastday;
              item.weatherForecast = markWeatherForecast(weather_data);
            } catch (err) {
              item.weatherForecast = [];
              console.error("Call weather API failed...");
            }
          });

    await Promise.all(weatherAPIRequests).catch(error => {
        console.error("Error processing weatherAPIRequests:", error);
    });
    return nearby_observatory_list;
}


async function fetchAstronomyInfoOnScheduledDate(observatory_name, date) {
    try {
              const astronomy_response = await axios.get(
                `http://api.weatherapi.com/v1/astronomy.json?key=${CONFIDENTIAL_WEATHER_API_KEY}&q=${observatory_name}&date=${date}`);
              const astronomy_data = {
                 sunrise: astronomy_response.data.astronomy.astro.sunrise,
                 sunset: astronomy_response.data.astronomy.astro.sunset
              }
              return astronomy_data;
            } catch (err) {
              console.error(err);
            }
}

module.exports = {
    fetchNearbyObservatoryFromAPIs, fetchAstronomyInfoOnScheduledDate
};
