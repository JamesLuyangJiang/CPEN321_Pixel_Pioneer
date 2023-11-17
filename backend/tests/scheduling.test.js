const {
  getScheduledEvents,
  createScheduledEvent,
  deleteScheduledEvent,
} = require("../routes/scheduling");

// Interface POST https://pixelpioneer.canadacentral.cloudapp.azure.com:8081/scheduling/:userid/events
describe("Create an event", () => {
  test("Add an event unsuccessfully because ID does not exist", async () => {
    const req = {
      params: { id: 1 },
      body: { name: "Kitslano Beach", date: "2023-11-06" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    await createScheduledEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("FAILED because ID does not exist in database.");
  });
});
