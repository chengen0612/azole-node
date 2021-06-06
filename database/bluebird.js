const bluebird = require("bluebird");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
