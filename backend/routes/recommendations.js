const express = require("express");
const axios = require("axios");
const router = express.Router();
const apiManager = require("./apimanager");

const CONFIDENTIAL_WEATHER_API_KEY = "29af4c07ebdd4189a0b222326232410";

router.get("/:radius/:maximum_city_number", async (req, res) => {
    const radius = req.params.radius == null ? 1000 : req.params.radius;
    const maximum_city_number = req.params.maximum_city_number == null ? 10 : req.params.maximum_city_number;

    try {
        var nearby_observatory_list = [];
        nearby_observatory_list = await apiManager.fetchNearbyObservatoryFromAPIs(radius);

        var recommendation_list = generateRecommendationList(nearby_observatory_list, radius, maximum_city_number);
        // Process the data or send it as a response
        res.json(recommendation_list);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from the API' });
    }
});

router.post("/", (req, res) => {
  res.send(
    "This post request should return a list of recommended places based on the filters provided by the users."
  );
});
function generateRecommendationList(nearby_observatory_list, radius, maximum_city_number) {

    // Filtering results with condition_score of 3 and below
    // Filter the weatherForecast for each item in the list
    nearby_observatory_list.forEach(item => {
       item.weatherForecast = item.weatherForecast.filter(forecast => forecast.condition_score > 3);
       item.weatherForecast.sort((a, b) => {
           return  b.condition_score - a.condition_score;
       });
    });
    const maxDistance = radius;
    const minDistance = 0.01;
    // Sort the weatherForecast array for each observatory based on condition_score
    nearby_observatory_list.forEach(item => {
        if(item.distance > maxDistance) {
            maxDistance = item.distance;
        } else if (item.distance < minDistance) {
            minDistance = item.distance;
        }
    });
    nearby_observatory_list.forEach(item => {
        const distanceScore = (1 - (item.distance - minDistance) / (maxDistance - minDistance)) * 0.4;
        const conditionScore = item.weatherForecast[0].condition_score * 0.6 / 9;
        item.totalScore = (distanceScore + conditionScore) * 100;
    });
    if (nearby_observatory_list.length < maximum_city_number) {
        maximum_city_number = nearby_observatory_list.length;
    }

    var recommendation_list = []; // the actual json response of this request

    for (let i = 0; i < maximum_city_number; i++) {
      const currentObservatory = nearby_observatory_list[i];
      var recommended_observatory = {
          name: currentObservatory.name,
          distance: currentObservatory.distance.toFixed(2),
          date: currentObservatory.weatherForecast[0].date,
          condition: currentObservatory.condition,
          totalScore: currentObservatory.totalScore.toFixed(2),
      };
      recommendation_list.push(recommended_observatory);
    }
    return recommendation_list;
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

module.exports = router;
