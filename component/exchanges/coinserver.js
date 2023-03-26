const axios = require("axios").default;
const HttpsAgent = require("https-proxy-agent");

const agent = new HttpsAgent("http://192.168.1.4:8081");

const coinBaseUrl = "https://api.coinex.com/perpetual/v1/";

const coinInstance = axios.create({
  baseURL: coinBaseUrl,
  httpsAgent: agent,
  httpAgent: agent,
});

async function httpGetCoinOrderBooks(symbol) {
  coinInstance.defaults.params = {
    limit: 5,
    merge: 0,
    market: symbol,
  };
  const response = await coinInstance.get("market/depth");
  let coinOrderBook = sortOrderBooks(response.data.data, symbol);
  console.log(coinOrderBook);
  return coinOrderBook;
}

function sortOrderBooks(data, symbol) {
  return {
    [symbol]: { bids: data.bids, asks: data.asks },
  };
}

module.exports = {
  httpGetCoinOrderBooks,
};
