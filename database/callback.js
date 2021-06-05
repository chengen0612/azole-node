const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "tester",
  password: "tester",
  database: "stock",
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
