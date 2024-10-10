const express = require("express");
const { fetchLatestData } = require("../controller");

const statsRoute = express.Router();

statsRoute.get("/stats", fetchLatestData);

module.exports = statsRoute;
