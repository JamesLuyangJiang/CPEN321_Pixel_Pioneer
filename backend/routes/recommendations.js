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
    const distance = await getUserDistance(userid);

    const maximum_city_number = 10;

    try {
        // fetch organized observatory data from apimanager module
        const nearby_observatory_list = await apiManager.fetchNearbyObservatoryFromAPIs(distance, Number(days));
        const recommendation_list = generateRecommendationList(nearby_observatory_list, distance, maximum_city_number);
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

// Utilized ChatGPT to optimize the commented code, improving response time.
function generateRecommendationList(nearby_observatory_list, distance_preference, maximum_city_number) {
    // Calculate minDistance and maxDistance using reduce
    const { minDistance, maxDistance } = nearby_observatory_list
    .filter(item => item.weatherForecast.some(forecast => forecast.condition_score > 3))
    .reduce((acc, item) => {
        const itemDistance = Number(item.distance);
        if (itemDistance < acc.minDistance) {
            acc.minDistance = itemDistance;
        }
        if (itemDistance > acc.maxDistance) {
            acc.maxDistance = itemDistance;
        }
        return acc;
    }, { minDistance: 0.01, maxDistance: distance_preference });

    // Calculate total scores and sort the recommendation list in one pass
    const recommendation_list = nearby_observatory_list
        .map(item => {
            const item_distance = Number(item.distance);
            const weightedDistanceScore = (1 - (item_distance - minDistance) / (maxDistance - minDistance)) * 0.4;
            const weightedConditionScore = item.weatherForecast[0].condition_score * 0.6 / 9;
            const total_score = (weightedDistanceScore + weightedConditionScore) * 100;
            return {
                name: item.name,
                distance: item_distance.toFixed(2),
                date: item.weatherForecast[0].date,
                condition: item.weatherForecast[0].condition,
                total_score: total_score.toFixed(2),
            };
        })
        .sort((a, b) => b.total_score - a.total_score);

    return recommendation_list;
}

//function generateRecommendationList(nearby_observatory_list, distance_preference, maximum_city_number) {
//    var maxDistance = distance_preference;
//    var minDistance = 0.01;
//    // Filtering results with condition_score of 3 and below
//    nearby_observatory_list.forEach(item => {
//        item.weatherForecast = item.weatherForecast.filter(forecast => forecast.condition_score > 3)
//        .sort((a, b) => {return  b.condition_score - a.condition_score;});
//        if(Number(item.distance) > maxDistance) {
//            maxDistance = Number(item.distance);
//        } else if (Number(item.distance) < minDistance) {
//            minDistance = Number(item.distance);
//        }
//    });
//    // Sort the recommendation_list for each observatory based on total_score
//    const recommendation_list = []; // the actual json response of this request
//    nearby_observatory_list.forEach(item => {
//        const weightedDistanceScore = (1 - (item.distance - minDistance) / (maxDistance - minDistance)) * 0.4;
//        const weightedConditionScore = item.weatherForecast[0].condition_score * 0.6 / 9;
//        item.total_score = (weightedDistanceScore + weightedConditionScore) * 100;
////        item.sort((a, b) => {return  b.total_score - a.total_score;});
//        const recommended_observatory = {
//              name: item.name,
//              distance: item.distance.toFixed(2),
//              date: item.weatherForecast[0].date,
//              condition: item.weatherForecast[0].condition,
//              total_score: item.total_score.toFixed(2),
//        };
//        recommendation_list.push(recommended_observatory);
//    });
//    return recommendation_list;
//}

module.exports = router;
