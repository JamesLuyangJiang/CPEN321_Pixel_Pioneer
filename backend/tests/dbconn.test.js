const { MongoClient } = require("mongodb");
const { connectDB } = require("../routes/dbconn");

jest.mock("mongodb", () => {
  const actualMongoDB = jest.requireActual("mongodb");
  return {
    ...actualMongoDB,
    MongoClient: jest.fn().mockImplementation(() => {
      return {
        connect: jest.fn().mockResolvedValue(true),
        close: jest.fn().mockResolvedValue(true)
      };
    })
  };
});

describe('connectDB', () => {
  it('connects to the database successfully', async () => {
    const isConnected = await connectDB();
    expect(isConnected).toBe(true);
    expect(MongoClient).toHaveBeenCalledTimes(1);
  });
});
