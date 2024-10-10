const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.set("strictQuery", true);

const DB_CONNECTION_URL = process.env.DB_URL;

const connection = async () => {
  try {
    const client = await mongoose.connect(DB_CONNECTION_URL);
    console.log("connected with atlas");
  } catch (err) {
    console.log(err);
  }
};
module.exports = { connection };
