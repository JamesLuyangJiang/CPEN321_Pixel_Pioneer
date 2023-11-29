const apiManager = require("./apimanager");
const { connectDB, checkIDExists } = require("./dbconn");

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let days_duration = "";
// ChatGPT usage: NO
// This is a handler for the GET request
// Organize all the dependencies here
// to return our recommendation list to the client
async function recommendationRequestHandler(req, res) {
  const isConnected = await connectDB();
  if (isConnected) {
    try {
      const userid = req.params.userid;
      const days = req.params.days;
      days_duration = days;
      const maximum_city_number = 10;
      let publicIP = req.ip.substring(7);
      if(req.body.mockTesting && req.body.ip) {
            publicIP = req.body.ip;
      }
      const user = await checkIDExists(userid);
      if (!user) {
        console.log("USER DOES NOT EXIST IN DATABASE");
        res.status(404).send("User not found.");
      } else {
        const distance = user.distance;
        console.log("DISTANCE IS: ", distance);
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
        res.status(200).json(recommendation_list);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to generate recommendation list" });
    } finally {
      await client.close();
      console.log("DATABASE CLOSED SUCCESSFULLY.");
    }
  } else {
    res.status(500).send("DATABASE REFUSED TO CONNECT.");
  }
}

// ChatGPT usage: No
function getDateDiffScore(client_time, observatory_date) {
  const client_date = new Date(client_time);
  const forecast_date = new Date(observatory_date);
  const time_diff = Math.abs(forecast_date - client_date);
  const days_diff = Math.ceil(time_diff / (24 * 60 * 60 * 1000));
  let date_diff_score = (1 - days_diff / Number(days_duration)) * 10;
  return date_diff_score;
}

// ChatGPT usage: Partial
// Utilized ChatGPT to optimize the commented code, improving response time.
// Then refined the code based on the actual requirement.
function generateRecommendationList(
  nearby_observatory_list,
  distance_preference,
  maximum_city_number
) {
  if (
    !Array.isArray(nearby_observatory_list) ||
    !nearby_observatory_list.length
  ) {
    throw new Error("Invalid observatory list");
  }

  // Calculate minDistance and maxDistance using reduce
  const { min_distance, max_distance } = nearby_observatory_list
    .filter(
      (item) =>
        item.weatherForecast &&
        item.weatherForecast.some((forecast) => forecast.condition_score > 20)
    )
    .reduce(
      (acc, item) => {
        const item_distance = Number(item.distance);
        acc.min_distance = Math.min(acc.min_distance, item_distance);
        acc.max_distance = Math.max(acc.max_distance, item_distance);
        return acc;
      },
      { min_distance: 0.01, max_distance: distance_preference }
    );

  // Calculate total scores and sort the recommendation list
  const recommendation_list = nearby_observatory_list
    .map((item) => {
      const sorted_forecasts = item.weatherForecast.sort((a, b) => {
        if (b.condition_score !== a.condition_score) {
          return b.condition_score - a.condition_score;
        }
        return (
          getDateDiffScore(b.client_time, b.date) -
          getDateDiffScore(a.client_time, a.date)
        );
      });

      const best_forecast = sorted_forecasts[0];
      const item_distance = Number(item.distance);
      const weighted_distance_score =
        (1 - (item_distance - min_distance) / (max_distance - min_distance)) *
        0.3;
      const weighted_condition_score =
        (best_forecast.condition_score * 0.6) / 100;
      const weighted_date_score =
        (getDateDiffScore(best_forecast.client_time, best_forecast.date) * 0.1) /
        10;

      const total_score =
        (weighted_distance_score +
          weighted_condition_score +
          weighted_date_score) *
        100;

      return {
        name: item.name,
        distance: item_distance.toFixed(2),
        date: best_forecast.date,
        condition: best_forecast.condition,
        total_score: total_score.toFixed(2),
      };
    })
    .sort((a, b) => b.total_score - a.total_score);

  return recommendation_list.slice(0, maximum_city_number);
}

module.exports = { recommendationRequestHandler };
