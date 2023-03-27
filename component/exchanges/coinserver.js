const axios = require("axios").default;
const HttpsAgent = require("https-proxy-agent");
const symbols = require("../../symbols/symbols");

const agent = new HttpsAgent("http://192.168.1.11:8081");

const coinBaseUrl = "https://api.coinex.com/perpetual/v1/";

const coinInstance = axios.create({
  baseURL: coinBaseUrl,
  httpsAgent: agent,
  // httpAgent: agent,
});
httpGetCoinOrderBooks()
async function httpGetCoinOrderBooks() {

  const response = await coinInstance.get("/market/ticker/all");
  let coinOrderBook = sortOrderBooks(response.data.data.ticker);
  // console.log(Object.keys(coinOrderBook).length);
  return coinOrderBook;
}

function sortOrderBooks(data) {
  const orderBooks = {};
  symbols.forEach(function (symbol) {
    if (data.hasOwnProperty(symbol)) {
      orderBooks[symbol]={
        bid: data[symbol].buy,
        ask: data[symbol].sell
      }
    }
  })
  return orderBooks
}

module.exports = {
  httpGetCoinOrderBooks,
};
