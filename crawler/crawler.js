//第一種建入資料庫的做法 Promise.all()  每筆資料 insert 的 promise
const fs = require("fs/promises");
const Promise = require("bluebird");

const twse = require("./twse");
const connection = require("./db");

// 用await版
(async function () {
  try {
    await connection.connectAsync();

    let data = await fs.readFile("stocks.txt", "utf8");
    let array = await data.split(",");
    // console.log(`讀到的stockNo:${array[0]}、${array[1]}、${array[2]}`);
    for (let i = 0; i < array.length; i++) {
      let stock = await connection.queryAsync(
        `SELECT stock_id FROM stock WHERE stock_id=${array[i]}`
      );
      //   console.log(stock);
      //stock.length <= 0 ， 如果我們輸入的代碼資料庫找不到，執行axios抓取
      if (stock.length <= 0) {
        let stockNoName = await twse.queryStockName(array[i]);

        //stockNoName[0],stockNoName[1]
        //抓取的資料有[stock_id, stock_name],寫入資料庫
        if (stockNoName) {
          connection.queryAsync(
            `INSERT INTO stock (stock_id, stock_name) VALUES ('${stockNoName[0]}','${stockNoName[1]}');`
          );
        } else
          console.log(
            `該筆股票代號: ${stockNoName[0]} 不符合輸入資料庫參數設定`
          );
      } else console.log(`該筆股票代號: ${array[i]} 已建入過資料庫`);

      //到這一步表示stock資料庫已經有了或著已建入新的stock_id 跟 stock_name
      console.log(`查詢的股票: ${array[i]} 成交資料`);
      let stockPriceData = await twse.queryStockData(array[i]);
      //處理資料
      let insertPromises = stockPriceData.map((item) => {
        //鍵入資料庫 stock_price
        //在多筆資料的情況下，VALUE 後面 可用(?) 來取代
        //單一筆則只能用 ? ，不能有括弧
        //MySQL -> IGNORE 避免"重複插入記錄"的方法=> 有鍵入過的資料會跳過 ， 超好用XD
        return connection.queryAsync(
          "INSERT IGNORE INTO stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES (?)",
          [item]
        );
      });
      //
      let insertResults = await Promise.all(insertPromises);
      console.log(
        `鍵入的股票代號(${array[i]})資料有: ${insertResults.length} 筆`
      );
    }
  } catch (err) {
    console.error(err);
  } finally {
    //最後最後，記得關閉資料庫
    connection.end();
  }
})();
