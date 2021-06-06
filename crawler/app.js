// https://www.twse.com.tw/exchangeReport/STOCK_DAY
// ?response=json
// &date=20210523
// &stockNo=2610

// npm i axios
// 引入 axios
const axios = require("axios");
const moment = require("moment");
const fs = require("fs/promises");
const mysql = require("mysql");
const Promise = require("bluebird");
require("dotenv").config();

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection = Promise.promisifyAll(connection);
(async function () {
  try {
    await connection.connectAsync();

    let stockCode = await fs.readFile("stock.txt", "utf8");
    console.log(`讀到的 stock code: ${stockCode}`);
    let stock = await connection.queryAsync(
      `SELECT stock_id FROM stock WHERE stock_id = ?`,
      [stockCode]
    );
    console.log("確認資料庫資料筆數:" + stock.length);

    if (stock.length <= 0) {
      console.log("Start to query name");
      let response = await axios.get(
        `https://www.twse.com.tw/zh/api/codeQuery?query=${stockCode}`
      );
      let answer = response.data.suggestions.shift();
      let answers = answer.split("\t");
      console.log(answers);
      if (answers.length > 1) {
        console.log(`儲存股票名稱 ${answers[0]} ${answers[1]}`);
        console.log("answers:", answers);
        connection.queryAsync(
          `INSERT INTO stock (stock_id, stock_name) VALUES (?);`,
          [answers]
        );
      } else {
        throw "查詢股票名稱錯誤";
      }
    }

    // 表示 stock 裡，已經有該 stock id 跟 name 了
    console.log(`查詢股票成交資料 ${stockCode}`);
    let prices = await axios.get(
      "https://www.twse.com.tw/exchangeReport/STOCK_DAY",
      {
        params: {
          response: "json",
          date: moment().format("YYYYMMDD"),
          stockNo: stockCode,
        },
      }
    );
    if (prices.data.stat !== "OK") {
      throw "查詢股價失敗";
    }
    // 處理資料
    // console.log(prices.data.data);
    // 處理多筆資料
    // 民國年
    // '1,639,689,721' 字串、而且有逗號 --> 要處理逗號，然後再轉數字
    // +13.00 不需要先處理 + - 號
    //["日期","成交股數","成交金額","開盤價","最高價","最低價","收盤價","漲跌價差","成交筆數"],
    //["110/06/01","18,405,285","10,985,893,229","1,598.00","599.00","595.00","598.00","+1.00","20,318"],
    // 作法一：Promise.all 的做法，所以他要做出每筆資料 insert 的 promise
    // let insertPromises = prices.data.data.map((item) => {
    //   item = item.map((value) => {
    //     return value.replace(/,/g, "");
    //   });
    //   // 110/06/01 -> 西元年
    //   // 想知道的找奕任
    //   // parseInt(item[0].replace(/[^\w\s]|_/g, "").replace(/\s+/g, " "), 10) + 19110000;
    //   // item[0].replace(/\//g, "") -> 1100601 -> 20210601  YYYYMMDD -> YYYY-MM-DD YYYY/MM/DD
    //   // 另外一種做法：把[年] 加上 1911 再放回去跟月,日組合
    //   // Date
    //   item[0] = parseInt(item[0].replace(/\//g, ""), 10) + 19110000; // 20210601
    //   item[0] = moment(item[0], "YYYYMMDD").format("YYYY-MM-DD"); // 2021-06-01
    //   item.unshift(stockCode);

    //   return connection.queryAsync(
    //     "INSERT IGNORE INTO stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES (?)",
    //     [item]
    //   );
    // });
    // let insertResults = await Promise.all(insertPromises);
    // console.log(insertResults.length);

    // 作法2: 批次 insert
    let prepareData = prices.data.data.map((item) => {
      item = item.map((value) => {
        return value.replace(/,/g, "");
      });

      item[0] = parseInt(item[0].replace(/\//g, ""), 10) + 19110000; // 20210601
      item[0] = moment(item[0], "YYYYMMDD").format("YYYY-MM-DD"); // 2021-06-01
      item.unshift(stockCode);
      return item;
    });
    // console.log(prepareData);
    let insertResult = await connection.queryAsync(
      "INSERT IGNORE INTO stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES ?",
      [prepareData]
    );
    console.log(insertResult);
  } catch (err) {
    console.error("我是 catch");
    console.error(err);
  } finally {
    connection.end();
  }
})();
