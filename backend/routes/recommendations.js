const express = require("express");
const axios = require("axios");
const router = express.Router();
const apiManager = require("./apimanager");
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const CONFIDENTIAL_WEATHER_API_KEY = "29af4c07ebdd4189a0b222326232410";

router.get("/:userid/:days", async (req, res) => {
    const { userid, days } = req.params;
    console.log("days: " + days);
    const distance = await getUserDistance(userid);

    const maximum_city_number = 10;

    try {
        // fetch organized observatory data from apimanager module
        const nearby_observatory_list = await apiManager.fetchNearbyObservatoryFromAPIs(distance, Number(days));
        const recommendation_list = generateRecommendationList(nearby_observatory_list, distance, maximum_city_number);
        console.log("recommendation_list" + recommendation_list);
        // Process the data or send it as a response
        res.json(recommendation_list);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate recommendation list' });
    }
});

router.post("/", (req, res) => {
  res.send(
    "This post request should return a list of recommended places based on the filters provided by the users."
  );
});

async function getUserDistance(userid) {
    try {
            await client.connect();
            try {
              // Fetch the current user by userid
              const user = await client
                  .db("astronomy")
                  .collection("users")
                  .findOne({ userid: userid });

              if (!user) {
                  return 1000; // Default distance
              }
              return Number(user.distance) || 1000; // Set distance from user's data. If its null, set 1000
            } catch (err) {
              console.log(err);
            }
    } catch (err) {
      console.log(err);
      await client.close();
      return 1000; // Default distance
    }
}

function generateRecommendationList(nearby_observatory_list, distance_preference, maximum_city_number) {
    // Filtering results with condition_score of 3 and below
    // Filter the weatherForecast for each item in the list
    nearby_observatory_list.forEach(item => {
       item.weatherForecast = item.weatherForecast.filter(forecast => forecast.condition_score > 3)
       .sort((a, b) => {return  b.condition_score - a.condition_score;});

    });
    var maxDistance = distance_preference;
    var minDistance = 0.01;
    // Sort the weatherForecast array for each observatory based on condition_score
    nearby_observatory_list.forEach(item => {
        if(Number(item.distance) > maxDistance) {
            maxDistance = Number(item.distance);
        } else if (Number(item.distance) < minDistance) {
            minDistance = Number(item.distance);
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
    console.log("nearby_observatory_list.length: " + nearby_observatory_list.length)
    const recommendation_list = []; // the actual json response of this request

    for (let i = 0; i < maximum_city_number; i++) {
      const currentObservatory = nearby_observatory_list[i];
      const recommended_observatory = {
          name: currentObservatory.name,
          distance: currentObservatory.distance.toFixed(2),
          date: currentObservatory.weatherForecast[0].date,
          condition: currentObservatory.weatherForecast[0].condition,
          totalScore: currentObservatory.totalScore.toFixed(2),
      };
      recommendation_list.push(recommended_observatory);
    }
    console.log("testing testing!!!");
    console.log("recommendation_list" + recommendation_list);
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
