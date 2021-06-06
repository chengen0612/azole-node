const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log(connection.state);

// connection.connect();
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log(connection.state);

  console.log("connected as id " + connection.threadId);
});

connection.query("SELECT * FROM stock", function (err, result) {
  if (err) {
    console.log("[SELECT ERROR] - ", err.message);
    return;
  }

  console.log(`查回筆數: ${result.length}`);
});

connection.end();
