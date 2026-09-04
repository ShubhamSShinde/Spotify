const mongoose = require("mongoose");

let isConnected = false;

const ConnectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is missing from environment variables!");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = ConnectDB;