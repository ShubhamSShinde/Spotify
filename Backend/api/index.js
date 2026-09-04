require("dotenv").config();
const app = require("../src/app");
const ConnectDB = require("../src/db/db");

// Connect to MongoDB on serverless request invocation
module.exports = async (req, res) => {
  await ConnectDB();
  return app(req, res);
};
