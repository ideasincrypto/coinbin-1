const symbols = require("../symbols/symbols");
const { httpGetBinOrderBooks } = require("./exchanges/binserver");
const { httpGetCoinOrderBooks } = require("./exchanges/coinserver");
const { EventEmitter } = require("events");

const eventEmmiter = new EventEmitter();
intervalFunc()
function intervalFunc() {
  return setInterval(async function () {
    const allOrderBooks = await getAllOrderBooks();
    console.log("allOrderBooks:>",allOrderBooks);
    const rowsInfo = [];
    // ramzOrderBooks.forEach(function (ramzOrderBook) {
    //   if (ramzOrderBook.status == "fulfilled" && ramzOrderBook.value) {
    //     const symbol = Object.keys(ramzOrderBook.value)[0];
    //     if (nobOrderBooks.value) {
    //       const rowInfo = percentDiff(
    //         nobOrderBooks.value[symbol],
    //         ramzOrderBook.value[symbol],
    //         symbol
    //       );
    //       if (rowInfo) {
    //         rowsInfo.push(rowInfo);
    //       }
    //     }
    //   }
    // });

    // eventEmmiter.emit("diff", JSON.stringify(rowsInfo));
  }, 5000);
}

async function getAllOrderBooks() {
  const binOrderBooksPromise = symbols.map(function (symbol) {
    return httpGetBinOrderBooks(symbol);
  });
  const coinOrderBooksPromise = symbols.map(function (symbol) {
    return httpGetCoinOrderBooks(symbol);
  });

  const promisesArray = [binOrderBooksPromise, coinOrderBooksPromise];
  console.log(promisesArray);
  // return await Promise.allSettled(promisesArray);
}

function percentDiff(nobOrderSymbol, ramzOrderSymbol, symbol) {
  if (exsistAskBid()) {
    if (nobBidIsSmallerRamzAsk()) {
      const nobBuyTmn = nobOrderSymbol["bids"][0][0] / 10;
      const ramSellTmn = ramzOrderSymbol["asks"][0][0] / 10;
      const rowData = {};
      rowData["symbol"] = symbol;
      rowData["percent"] = calcPercentDiff(nobBuyTmn, ramSellTmn);
      rowData["nob"] = nobBuyTmn;
      rowData["ram"] = ramSellTmn;
      rowData["value"] = Math.floor(ramSellTmn - nobBuyTmn);
      rowData["description"] = atleastBuyInNob();
      return {
        statusbuy: "nob",
        rowData,
      };
      // tableData.push(diffData);
      // console.log("kharid dar Nob:", symbol, tableData);
    }
    if (ramzBidIsSmallerRamzAsk()) {
      const nobSellTmn = nobOrderSymbol["asks"][0][0] / 10;
      const ramBuyTmn = ramzOrderSymbol["bids"][0][0] / 10;
      const rowData = {};
      rowData["symbol"] = symbol;
      rowData["percent"] = calcPercentDiff(ramBuyTmn, nobSellTmn);
      rowData["nob"] = nobSellTmn;
      rowData["ram"] = ramBuyTmn;
      rowData["value"] = Math.floor(nobSellTmn - ramBuyTmn);
      rowData["description"] = atleastBuyInRamz();
      return {
        statusbuy: "ram",
        rowData,
      };
      // console.log("kharid dar Ramz:", symbol, percentDiffRamz);
    }
  }

  return false;
  function exsistAskBid() {
    return (
      nobOrderSymbol["bids"].length == 5 &&
      nobOrderSymbol["asks"].length == 5 &&
      ramzOrderSymbol["bids"].length == 5 &&
      ramzOrderSymbol["asks"].length == 5
    );
  }

  function nobBidIsSmallerRamzAsk() {
    return nobOrderSymbol["bids"][0][0] < ramzOrderSymbol["asks"][0][0];
  }

  function calcPercentDiff(a, b) {
    const percent = ((b - a) / a) * 100;
    return Math.floor(percent * 100) / 100;
  }

  function ramzBidIsSmallerRamzAsk() {
    return ramzOrderSymbol["bids"][0][0] < nobOrderSymbol["asks"][0][0];
  }

  function atleastBuyInNob() {
    const min = Math.min(
      nobOrderSymbol["bids"][0][1],
      ramzOrderSymbol["asks"][0][1]
    );
    const minTmn = Math.floor((min * nobOrderSymbol["bids"][0][0]) / 10);
    return `ارزی:${min} | تومانی:${minTmn}`;
  }

  function atleastBuyInRamz() {
    const min = Math.min(
      ramzOrderSymbol["bids"][0][1],
      nobOrderSymbol["asks"][0][1]
    );
    const minTmn = Math.floor((min * ramzOrderSymbol["bids"][0][0]) / 10);
    return `ارزی:${min} | تومانی:${minTmn}`;
  }
}

module.exports = {
  percentDiff,
  getAllOrderBooks,
  eventEmmiter,
  intervalFunc,
  // console.log("symbols::>", symbols);
};
