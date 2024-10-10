const axios  = require("axios");
const Crypto = require("../models/Currenices");
const cron = require('node-cron');

async function fetchCryptoData() {
    try {
      const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,matic-network&vs_currencies=usd&include_market_cap=true&include_24hr_change=true';
      const response = await axios.get(url);
      const data = response.data;
  
      const cryptocurrencies = [
        { name: 'Bitcoin', id: 'bitcoin' },
        { name: 'Ethereum', id: 'ethereum' },
        { name: 'Matic', id: 'matic-network' },
      ];
  
      cryptocurrencies.forEach(async (crypto) => {
        const { usd: price, usd_market_cap: marketCap, usd_24h_change: change24h } = data[crypto.id];
  
        const cryptoEntry = new Crypto({
          name: crypto.name,
          price,
          marketCap,
          change24h,
        });
  
        await cryptoEntry.save();
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  cron.schedule('0 */2 * * *', () => {
    fetchCryptoData();
  });

const fetchLatestData = async (req, res) => {
  const { coin } = req.query;

  try {
    const latestData = await Crypto.findOne({
      name: new RegExp(coin, "i"),
    }).sort({ timestamp: -1 });

    if (!latestData) {
      return res
        .status(404)
        .json({ message: "No data found for the requested coin" });
    }

    res.json({
      price: latestData.price,
      marketCap: latestData.marketCap,
      "24hChange": latestData.change24h,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const calculateDeviation = async (req, res) => {
  const { coin } = req.query;

  try {
    const data = await Crypto.find({ name: new RegExp(coin, "i") })
      .sort({ timestamp: -1 })
      .limit(100);

    if (data.length < 2) {
      return res
        .status(400)
        .json({ message: "Not enough data to calculate deviation" });
    }

    const prices = data.map((entry) => entry.price);
    const deviation = calculateDeviation(prices);

    res.json({ deviation: deviation.toFixed(2) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { fetchLatestData, calculateDeviation, fetchCryptoData };
