const express = require("express");
const app = express();

const {
  createScheduledEvent,
  getScheduledEvents,
  deleteScheduledEvent,
} = require("./routes/scheduling");
const { getProfile, createProfile, updateProfile } = require("./routes/users");
const { inviteSpecifiedUser } = require("./routes/invite");
const { recommendationRequestHandler } = require("./routes/recommendations");
const { searchUserEmails } = require("./routes/searchEmail");

app.use(express.json());
// app.use("/recommendations", recommendationsRoutes);
// app.use("/scheduling", schedulingRoutes);
// app.use("/users", userRoutes);
// app.use("/invitation", invitationRoutes);

// router.get("/:id/events", getScheduledEvents);
// router.post("/:id/events", createScheduledEvent);
// router.delete("/:id/events/delete", deleteScheduledEvent);

// Index Page
app.get("/", (req, res) => {
  res.status(200).send("Server is running on port 8081");
});

// Scheduling Routes
app.get("/scheduling/:id/events", getScheduledEvents);
app.post("/scheduling/:id/events", createScheduledEvent);
app.delete("/scheduling/:id/events/delete", deleteScheduledEvent);

// User Routes
app.get("/users/get/:userid", getProfile);
app.put("/users/update/:userid", updateProfile);
app.post("/users/create", createProfile);

// Invitation Routes
app.post("/invitation/:userid", inviteSpecifiedUser);

// Recommendation Routes
app.get("/recommendations/:userid/:days", recommendationRequestHandler);

// Search Routes
app.get("/search/allemails", searchUserEmails);

module.exports = app;
