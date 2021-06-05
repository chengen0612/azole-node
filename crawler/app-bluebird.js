const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const Promise = require("bluebird");

// 因為用 bluebird 所以不用自己包
// function readFilePromise() {
//   return new Promise((resolve, reject) => {
//     fs.readFile("stock.txt", "utf8", (err, data) => {
//       if (err) {
//         reject(err);
//       }
//       resolve(data);
//     });
//   });
// }

// 方法1: 一個函是一個函式包
// 用 bluebird 包 callback 版本的 readFile
// const readFile = Promise.promisify(fs.readFile);

// 方法2: 整個 fs 都包起來
// 把 fs 所有的 function 都包成 promise
// 但是原本的函式名稱後面會被加上 Async
const fsBlue = Promise.promisifyAll(fs);
fsBlue
  .readFileAsync("stock.txt", "utf-8")
  .then((stockCode) => {
    console.log("stockCode:", stockCode);

    return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
      params: {
        response: "json",
        date: moment().format("YYYYMMDD"),
        stockNo: stockCode,
      },
    });
  })
  .then((response) => {
    if (response.data.stat === "OK") {
      console.log(response.data.date);
      console.log(response.data.title);
    }
  })
  .catch((err) => {
    console.error(err);
  });
