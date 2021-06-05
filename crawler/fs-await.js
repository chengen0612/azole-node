const axios = require("axios");
// 引入 promise 版本
const fs = require("fs/promises");
const moment = require("moment");

// 因為有 fs 的 promise 版本，所以不用自己包了
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

(async function () {
  try {
    // await 回來就是 resolve
    let stockCode = await fs.readFile("stock.txt", "utf-8");
    let response = await axios.get(
      "https://www.twse.com.tw/exchangeReport/STOCK_DAY",
      {
        params: {
          response: "json",
          date: moment().format("YYYYMMDD"),
          stockNo: stockCode,
        },
      }
    );
    if (response.data.stat === "OK") {
      console.log(response.data.date);
      console.log(response.data.title);
    } else {
      // TODO 應該要處理查不回來
    }
  } catch (err) {
    console.error(err);
    // TODO
    // 通知管理員來處理
    // 過幾分鐘後重試
  }
})();
