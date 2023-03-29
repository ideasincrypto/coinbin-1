const axios = require("axios").default;
const symbols = require('../../symbols/symbols');
const HttpsAgent = require("https-proxy-agent");
const {httpsOverHttp} = require('tunnel')

// const agent = new HttpsAgent("http://192.168.1.4:8081");
const agent = httpsOverHttp({
  proxy: {
    host: "192.168.1.11",
    port: 8081
  }
});

const binBaseUrl = "https://fapi.binance.com/fapi/v1";

const binInstance = axios.create({
  baseURL: binBaseUrl,
  httpsAgent: agent,
});
// httpGetBinOrderBooks()
async function httpGetBinOrderBooks() {

  const response = await binInstance.get("/ticker/bookTicker");
  const orderBooks = sortOrderBooks(response.data);
  // console.log("binOrderBooks:>",Object.keys(orderBooks).length);
  return orderBooks;
}

function sortOrderBooks(data) {
  const orderBooks = {}
  data.forEach(function (el) {
    if (symbols.includes(el.symbol) ) {
      orderBooks[el.symbol] = {
        "bid":el.bidPrice,
        "ask":el.askPrice,
      }
    }
  })
  return orderBooks;
}

module.exports = {
  httpGetBinOrderBooks,
};
