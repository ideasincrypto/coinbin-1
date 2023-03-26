const axios = require("axios").default;
const HttpsAgent = require("https-proxy-agent");

const agent = new HttpsAgent("http://192.168.1.4:8081");

const binBaseUrl = "https://fapi.binance.com/fapi/v1";

const binInstance = axios.create({
  baseURL: binBaseUrl,
  httpsAgent: agent,
  httpAgent: agent,
});

async function httpGetBinOrderBooks(symbol) {
  binInstance.defaults.params = {
    limit: 5,
    symbol,
  };
  const response = await binInstance.get("/depth");
  const orderBooks = sortOrderBooks(response.data, symbol);
  console.log("binOrderBooks:>", orderBooks);
  return orderBooks;
}

function sortOrderBooks(data, symbol) {
  return {
    [symbol]: { bids: data.bids, asks: data.asks },
  };
}

module.exports = {
  httpGetBinOrderBooks,
};
