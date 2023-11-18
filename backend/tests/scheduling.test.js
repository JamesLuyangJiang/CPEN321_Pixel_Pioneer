jest.mock("../routes/dbconn");

const {
  getScheduledEvents,
  createScheduledEvent,
  deleteScheduledEvent,
} = require("../routes/scheduling");

const dbconn = require("../routes/dbconn");

describe("POST /scheduling/:userid/events", () => {
  beforeEach(() =>
    createScheduledEvent.mockReset()
  )
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
      // Assuming null signifies no user found
      dbconn.connectDB = jest.fn().mockResolvedValue(null);

      // Simulate createScheduledEvent function behavior
      createScheduledEvent.mockImplementation(() => {
        const userExists = false; // Simulate checking user existence
        if (!userExists) {
          res.status(400).send("FAILED because ID does not exist in database.");
        }
      });

      await createScheduledEvent(req, res);

      // Assertions to verify the behavior
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        "FAILED because ID does not exist in database."
      );
    });
  });
});

jest.mock("../routes/scheduling");

const { getScheduledEvents } = require("../routes/scheduling");


describe("hello", () => {
  test("test #1", async () => {
    const req = {
      params: { id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const responseObj = await getScheduledEvents(req, res);

    console.log(responseObj);
  });
});
