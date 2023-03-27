const symbols = require("../symbols/symbols");
const { httpGetBinOrderBooks } = require("./exchanges/binserver");
const { httpGetCoinOrderBooks } = require("./exchanges/coinserver");
const { EventEmitter } = require("events");

const eventEmmiter = new EventEmitter();
intervalFunc();
async function intervalFunc() {
  // return setInterval(async function () {
  const allOrderBooks = await getAllOrderBooks();
  const binOrderBooks = allOrderBooks.binOrderBooks;
  const coinOrderBooks = allOrderBooks.coinOrderBooks;

  // console.log("allOrderBooks:>", allOrderBooks);
  const rowsInfo = [];
  if (binOrderBooks.status == "fulfilled" && coinOrderBooks.status == "fulfilled") {
    symbols.forEach(function (symbol) {
      // console.log(binOrderBook.value);;
      const rowInfo = percentDiff(
        binOrderBooks.value[symbol],
        coinOrderBooks.value[symbol],
        symbol
      );
      if (rowInfo) {
        rowsInfo.push(rowInfo);
        console.log(rowInfo.rowData.percent,rowInfo.rowData.symbol);
      }
    })
    // console.log("rowsInfo:>",rowsInfo);
  };
  //  console.log(rowsInfo);
  // eventEmmiter.emit("diff", JSON.stringify(rowsInfo));
  // }, 5000);
}

async function getAllOrderBooks() {
  const binOrderBooksPromise = httpGetBinOrderBooks();
  const coinOrderBooksPromise = httpGetCoinOrderBooks();


  const promisesArray = [binOrderBooksPromise, coinOrderBooksPromise];
  console.log(promisesArray);
  const allOrderBooks = await Promise.allSettled(promisesArray);
  const binOrderBooks = allOrderBooks[0];
  const coinOrderBooks = allOrderBooks[1];
  return { binOrderBooks, coinOrderBooks };
}

function percentDiff(binOrderSymbol, coinOrderSymbol, symbol) {
  console.log(binOrderSymbol, coinOrderSymbol, symbol);

    if (binAskIsSmallercoinBid()) {
      const rowData = {};
      rowData["symbol"] = symbol;
      rowData["percent"] = calcPercentDiffBin();
      rowData["bin"] = binOrderSymbol["ask"];
      rowData["coin"] = coinOrderSymbol["bin"];
      rowData["value"] = Math.floor((coinOrderSymbol["bin"] - binOrderSymbol["ask"])*1000)/1000;
      rowData["description"] = "";
      // console.log(rowData);
      return {
        statusbuy: "bin",
        rowData,
      };
      // tableData.push(diffData);
      // console.log("kharid dar Nob:", symbol, tableData);
    }
    if (coinAskIsSmallerBinBid()) {
      const rowData = {};
      rowData["symbol"] = symbol;
      rowData["percent"] = calcPercentDiffCoin();
      rowData["bin"] = binOrderSymbol["bid"];
      rowData["coin"] = coinOrderSymbol["ask"];
      rowData["value"] = Math.floor((coinOrderSymbol["ask"] - binOrderSymbol["bid"])*1000)/1000;
      rowData["description"] = "";
      return {
        statusbuy: "coin",
        rowData,
      };
      // console.log("kharid dar Ramz:", symbol, percentDiffRamz);
    }


  return false;

  function binAskIsSmallercoinBid() {
    // console.log(binOrderSymbol["ask"]);
    return binOrderSymbol["ask"] < coinOrderSymbol["bin"];
  }

  function calcPercentDiffBin() {
    const percent = ((coinOrderSymbol["bid"] -binOrderSymbol["ask"]) / binOrderSymbol["ask"]) * 100;
    return Math.floor(percent * 100) / 100;
  }

  function coinAskIsSmallerBinBid() {
    return coinOrderSymbol["ask"] < binOrderSymbol["bid"];
  }

  function calcPercentDiffCoin() {
    const percent = ((binOrderSymbol["bid"] -coinOrderSymbol["ask"]) / coinOrderSymbol["ask"]) * 100;
    return Math.floor(percent * 100) / 100;
  }
  // function atleastBuyInbin() {
  //   const min = Math.min(
  //     binOrderSymbol["bids"][0][1],
  //     coinOrderSymbol["asks"][0][1]
  //   );
  //   const minTmn = Math.floor((min * binOrderSymbol["bids"][0][0]) / 10);
  //   return `ارزی:${min} | تومانی:${minTmn}`;
  // }

  function atleastBuyInRamz() {
    const min = Math.min(
      coinOrderSymbol["bids"][0][1],
      binOrderSymbol["asks"][0][1]
    );
    const minTtr = (min * coinOrderSymbol["bids"][0][0]);
    return `ارزی:${min} | تتری:${minTtr}`;
  }
}

module.exports = {
  percentDiff,
  getAllOrderBooks,
  eventEmmiter,
  intervalFunc,
  // console.log("symbols::>", symbols);
};
