const bluebird = require("bluebird");
const mysql = require("mysql");

let connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "tester",
  password: "tester",
  database: "stock",
});

connection = bluebird.promisifyAll(connection);

(async function () {
  try {
    await connection.connectAsync();
    let result = await connection.queryAsync("SELECT * FROM stock");

    console.log(`查回筆數: ${result.length}`);
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
})();
