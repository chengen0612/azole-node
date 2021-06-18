// http://expressjs.com/en/starter/hello-world.html
// 導入 express 這個 package
const express = require("express");
// 利用 express 建立一個 express application
let app = express();

// module < package < framework
// express is a package，但完整到足以被稱為是框架

// 可以指定一個或多個目錄是「靜態資源目錄」
// 自動幫你為 public 裡面的檔案建立路由
app.use(express.static("public"));

app.use(function (req, res, next) {
  console.log("無用 Middleware");
  // 「幾乎」都要呼叫，讓他往下繼續
  next();
});

// middleware 中間件 中介函式
// 在 express 裡
// req -> router
// req -> middleware..... -> router
app.use(function (req, res, next) {
  let current = new Date();
  console.log(`有人來訪問了喔 在 ${current}`);
  // 「幾乎」都要呼叫，讓他往下繼續
  next();
});

// 路由 router
// (request, response) {} 去回應這個請求
app.get("/", function (req, res) {
  res.send("Hello Express BBB");
});

app.get("/about", function (req, res, next) {
  // res.send("About Express AAAA");
  console.log("我是 ABOUT - AAAA");
  next();
});

app.get("/about", function (req, res) {
  console.log("我是 ABOUT - BBBBB");
  res.send("<h1>About Express BBBB</h1>");
});

app.get("/test", function (req, res) {
  res.send("Test Express");
});

app.listen(3000, () => {
  console.log(`我跑起來了喔 在 port 3000`);
});
