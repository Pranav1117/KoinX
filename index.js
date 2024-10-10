const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());

const dotenv = require("dotenv");
dotenv.config();

const { connection } = require("./Config/DB");
const statsRoute = require("./Routes/statsRoutes");
const devationRoute = require("./Routes/deviationRoute");
const { fetchCryptoData } = require("./controller");
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("home page");
});

app.use(statsRoute)
app.use(devationRoute)

app.listen(PORT, async () => {
  try {
    await connection();
    await fetchCryptoData();
    console.log(`running on ${PORT}`);
  } catch (err) {
    console.log(err);
  }
});
