const express = require("express");
const { calculateDeviation } = require("../controller");
const devationRoute = express.Router();

devationRoute.get("/deviation", calculateDeviation);

module.exports = devationRoute