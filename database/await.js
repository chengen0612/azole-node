const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "tester",
  password: "tester",
  database: "stock",
});

function connect() {
  return new Promise((resolve, reject) => {
    connection.connect(function (err) {
      if (err) {
        reject("資料庫連線錯誤");
      }

      resolve("資料庫連線成功");
    });
  });
}

function query() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM stock", function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

(async function () {
  try {
    await connect();
    let result = await query();

    console.log(`查回筆數: ${result.length}`);
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
})();
