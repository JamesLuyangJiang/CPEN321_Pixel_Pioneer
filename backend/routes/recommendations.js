const express = require("express");
const axios = require("axios");
const router = express.Router();
const apiManager = require("./apimanager");
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const CONFIDENTIAL_WEATHER_API_KEY = "29af4c07ebdd4189a0b222326232410";

// ChatGPT usage: NO
// This is a handler for the GET request
// Organize all the dependencies here
// to return our recommendation list to the client
async function recommendationRequestHandler(req, res) {
  const { userid, days } = req.params;
  const distance = await getUserDistance(userid);

  const maximum_city_number = 10;
  const publicIP = req.ip.substring(7);

  try {
    // fetch organized observatory data from apimanager module
    const nearby_observatory_list =
      await apiManager.fetchNearbyObservatoryFromAPIs(
        publicIP,
        distance,
        Number(days)
      );

    const recommendation_list = generateRecommendationList(
      nearby_observatory_list,
      distance,
      maximum_city_number
    );
    // Process the data or send it as a response
    res.json(recommendation_list);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to generate recommendation list" });
  }
}

// ChatGPT usage: NO
// Fetch user's preferred distance
// from user's profile database
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

// ChatGPT usage: Partial
// Utilized ChatGPT to optimize the commented code, improving response time.
// Then refined the code based on the actual requirement.
function generateRecommendationList(
  nearby_observatory_list,
  distance_preference,
  maximum_city_number
) {
  // Calculate minDistance and maxDistance using reduce
  const { min_distance, max_distance } = nearby_observatory_list
    .filter((item) =>
      item.weatherForecast.some((forecast) => forecast.condition_score > 3)
    )
    .reduce(
      (acc, item) => {
        const item_distance = Number(item.distance);
        if (item_distance < acc.min_distance) {
          acc.min_distance = item_distance;
        }
        if (item_distance > acc.max_distance) {
          acc.max_distance = item_distance;
        }
        return acc;
      },
      { min_distance: 0.01, max_distance: distance_preference }
    );

  // Calculate total scores and sort the recommendation list in one pass
  const recommendation_list = nearby_observatory_list
    .map((item) => {
      const item_distance = Number(item.distance);
      const weighted_distance_score =
        (1 - (item_distance - min_distance) / (max_distance - min_distance)) *
        0.4;
      const weighted_condition_score =
        (item.weatherForecast[0].condition_score * 0.6) / 9;
      const total_score =
        (weighted_distance_score + weighted_condition_score) * 100;
      return {
        name: item.name,
        distance: item_distance.toFixed(2),
        date: item.weatherForecast[0].date,
        condition: item.weatherForecast[0].condition,
        total_score: total_score.toFixed(2),
      };
    })
    .sort((a, b) => b.total_score - a.total_score);

  return recommendation_list.slice(0, maximum_city_number + 1);
}

router.get("/:userid/:days", recommendationRequestHandler);

module.exports = router;
