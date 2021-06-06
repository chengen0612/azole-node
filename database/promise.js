const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

new Promise((resolve, reject) => {
  connection.connect(function (err) {
    if (err) {
      reject("資料庫連線錯誤");
    }

    resolve("資料庫連線成功");
  });
})
  .then((result) => {
    console.log(result);
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM stock", function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  })
  .then((result) => {
    console.log(`查回筆數: ${result.length}`);
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    connection.end();
  });
