// http://expressjs.com/en/starter/hello-world.html
// 導入 express 這個 package
const express = require("express");
// 利用 expresss 建立一個 express application app
let app = express();

// module < package < framework
// express is a package，但完整到足以被稱為是框架

// middleware 中間件 中介函式
// 在 express 裡
// req -> router
// req -> middlewares..... -> router
app.use(function (req, res, next) {
  let current = new Date();
  console.log(`有人來訪問了喔 在 ${current}`);
  // 幾乎都要呼叫，讓他往下繼續
  next();
});

// 路由 router
app.get("/", function (req, res) {
  res.send("Hello Express");
});

app.get("/about", function (req, res) {
  res.send("About Express AAAAAA");
});

app.get("/test", function (req, res) {
  res.send("Test Express");
});

app.listen(3000, () => {
  console.log(`我跑起來了喔 在 port 3000`);
});
