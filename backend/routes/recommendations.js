const express = require("express");
const router = express.Router();
const apiManager = require("./apimanager");
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// ChatGPT usage: NO
// This is a handler for the GET request
// Organize all the dependencies here
// to return our recommendation list to the client
async function recommendationRequestHandler(req, res) {
  const userid = req.params.userid;
  const days = req.params.days;
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
    await client.connect();
    try {
      // Fetch the current user by userid
      const user = await client
        .db("astronomy")
        .collection("users")
        .findOne({ userid });
      // Set distance from user's data. If its null, set 1000
      return user && user.distance ? Number(user.distance) : 1000;
    } catch (err) {
      console.error("Error fetching user distance:", err);
    } finally {
    await client.close();
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
  if (!Array.isArray(nearby_observatory_list) || !nearby_observatory_list.length) {
    throw new Error('Invalid observatory list');
  }

  // Remove duplicates from the list based on the name
  const uniqueObservatoryList = nearby_observatory_list
    .reduce((acc, current) => {
      const x = acc.find(item => item.name === current.name);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

  // Calculate minDistance and maxDistance using reduce
  const { min_distance, max_distance } = uniqueObservatoryList
    .filter((item) =>
      item.weatherForecast && item.weatherForecast.some((forecast) => forecast.condition_score > 3)
    )
    .reduce(
      (acc, item) => {
        const item_distance = Number(item.distance);
        acc.min_distance = Math.min(acc.min_distance, item_distance);
        acc.max_distance = Math.max(acc.max_distance, item_distance);
        return acc;
      },
      { min_distance: Infinity, max_distance: 0 }
    );

  // Calculate total scores and sort the recommendation list
  const recommendation_list = uniqueObservatoryList
    .map(item => {
      // Choose the forecast with the highest date score
      const bestForecast = item.weatherForecast.reduce((best, current) => {
        return (best.condition_score * best.date_score > current.condition_score * current.date_score) ? best : current;
      }, { condition_score: -1 });

      if (!bestForecast || bestForecast.condition_score === -1) {
        return null;
      }

      const item_distance = Number(item.distance);
      const weighted_distance_score =
        (1 - (item_distance - min_distance) / (max_distance - min_distance)) * 0.3;
      const weighted_condition_score = (bestForecast.condition_score * 0.5) / 9;
      const weighted_date_score = (bestForecast.date_score * 0.2);

      const total_score =
        (weighted_distance_score + weighted_condition_score + weighted_date_score) * 100;

      return {
        name: item.name,
        distance: item_distance.toFixed(2),
        date: bestForecast.date,
        condition: bestForecast.condition,
        total_score: total_score.toFixed(2),
      };
    })
    .filter(item => item !== null)
    .sort((a, b) => b.total_score - a.total_score);

  return recommendation_list.slice(0, maximum_city_number);
}


router.get("/:userid/:days", recommendationRequestHandler);

module.exports = router;
