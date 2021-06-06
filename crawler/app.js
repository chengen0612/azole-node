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
  } catch (err) {
    console.error("我是 catch");
    console.error(err);
  } finally {
    connection.end();
  }
})();
