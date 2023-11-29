module.exports = {
  // ChatGPT usage: NO
  connectDB: jest.fn(),

  allUserEmails: jest.fn(),

  checkIDExists: jest.fn((userID) => {
    if (userID === "3") {
      return false;
    } else if (userID === "6") {
      return {
        userid: userID,
        email: "harthuang990517@gmail.com",
        distance: 25,
      };
    } else if (userID === "8") {
      throw new Error("Simulated error in getting user profile");
    } else {
      return true;
    }
  }),

  findAllEvents: jest.fn((userID) => {
    if (userID === "1") {
      return [];
    } else if (userID === "2") {
      return [
        { userid: userID, name: "Kitslano Beach", date: "2023-11-28" },
        { userid: userID, name: "UBC", date: "2023-12-01" },
        { userid: userID, name: "Random Event Name", date: "2029-10-10" },
      ];
    } else if (userID === "4") {
      return [{ userid: userID, name: "Kitslano Beach", date: "2023-11-28" }];
    } else if (userID === "5") {
      throw new Error("Simulated error in findAllEvent");
    } else {
      return [];
    }
  }),

  findOneEvent: jest.fn((userID, eventName) => {
    if (userID === "1") {
      return false;
    } else if (userID === "2") {
      if (eventName === "Kitslano Beach") {
        return true;
      } else if (eventName === "UBC") {
        return true;
      } else {
        return false;
      }
    } else if (userID === "4") {
      if (eventName === "Kitslano Beach") {
        return true;
      } else {
        return false;
      }
    } else if (userID === "5") {
      throw new Error("Simulated error in findOneEvent");
    } else {
      return false;
    }
  }),

  insertOneEvent: jest.fn((event_obj) => {
    if (event_obj.userid === "5") {
      throw new Error("Simulated error in insertOneEvent");
    } else {
      return true;
    }
  }),

  findOneAndDeleteOneEvent: jest.fn(() => {
    return true;
  }),

  findUserEmailExists: jest.fn((email) => {
    if (email === "testemailnotexists@gmail.com") {
      return false;
    } else if (email === "harthuang990517@gmail.com") {
      return true;
    } else if (email === "receivernotindatabase@gmail.com") {
      return false;
    } else if (email === "hannah@gmail.com") {
      return true;
    } else if (email === "invalid@gmail.com") {
      throw new Error("Invalid email to database.");
    } else {
      return false;
    }
  }),

  createNewUser: jest.fn(() => {
    return true;
  }),

  findEmailAndReplaceUserToken: jest.fn((email, newProfile) => {
    if (email === "harthuang990517@gmail.com") {
      return true;
    } else {
      return false;
    }
  }),

  updateExistingUser: jest.fn(() => {
    return true;
  }),
};
