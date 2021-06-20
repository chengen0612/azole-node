const connection = require("./utils/db");
require("dotenv").config();

// http://expressjs.com/en/starter/hello-world.html
// 導入 express 這個 package
const express = require("express");
// 利用 express 建立一個 express application
let app = express();

// module < package < framework
// express is a package，但完整到足以被稱為是框架

// npm i body-parser
// const bodyParser = reqiure("body-parser");
// app.use(bodyParser.urlencoded({ extended: false }));
// 但是， express 在某版本後，有把 epxress.urlencoded 加回來了
// 所以就可以直接用
// 加上這個中間件，我們就可以解讀 post 過來的資料
app.use(express.urlencoded({ extended: false }));
// 前端送 json data 時, express 才能解析
app.use(express.json());
// 想要拿到 cookie
const cookieParser = require("cookie-parser");
app.use(cookieParser());
// 想要可以處理 session
// 產生一個 session id，可以透過這個 session id 來找到存在伺服器端的 session
// (不論這個 session 是存在記憶體、硬碟、資料庫、redis..)
// 問題是怎麼知道這一個 request 的 session 是誰？？？？
// ==> session id 存在 cookie
//     express-session 預設的 cookie name: connect.sid
//     如此一來，每次來的 request 都會帶著這個 session id
//     這樣就會知道這個 request 的 session 是誰
const expressSession = require("express-session");
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

// 可以指定一個或多個目錄是「靜態資源目錄」
// 自動幫你為 public 裡面的檔案建立路由
// /javascripts/api.js
// /styles/main.css
// /images/101.jpeg
app.use(express.static("public"));
// app.use("/admin", express.static("public-admin"));

// 設定一些 application 變數
// 第一個是變數 views
// 第二個是檔案夾名稱
app.set("views", "views");
// 告訴 express 我們用的 view engine 是 pug
app.set("view engine", "pug");

// 把這個動作做在中間函式，就可以讓每個路由都用到
// 就不需要在每個路由都各自做一次
// 把 req.session 設定給 res.locals
app.use(function (req, res, next) {
  // 把 request 的 session 資料設定給 res 的 locals
  // views 就可以取得資料
  res.locals.member = req.session.member;
  next();
});
// locals 是 response 物件提供的一個屬性
// 讓我們可以傳遞資料到 views

app.use(function (req, res, next) {
  // 因為訊息只希望被顯示一次！
  // 所以傳到 views 一次後，就刪掉
  if (req.session.message) {
    res.locals.message = req.session.message;
    delete req.session.message;
  }
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
  console.log();
});

app.use(function (req, res, next) {
  console.log("無用 Middleware");
  // 「幾乎」都要呼叫，讓他往下繼續
  next();
  console.log("after 無用 middleware");
});

let stockRouter = require("./routes/stock");
app.use("/stock", stockRouter);
let apiRouter = require("./routes/api");
app.use("/api", apiRouter);
let authRouter = require("./routes/auth");
app.use("/auth", authRouter);
let memberRouter = require("./routes/member");
app.use("/member", memberRouter);

// 路由 router
// (request, response) {} 去回應這個請求
app.get("/", function (req, res) {
  // res.send("Hello Express BBB");
  console.log("這裡是首頁");

  res.cookie("lang", "zh-TW");

  res.render("index");
  // views/index.pug
});

app.get("/about", function (req, res, next) {
  // res.send("About Express AAAA");
  res.render("about");
});

// app.get("/about", function (req, res) {
//   console.log("我是 ABOUT - BBBBB");
//   res.send("<h1>About Express BBBB</h1>");
// });

app.get("/test", function (req, res) {
  // res.send("Test Express");
  next();
});

app.use(function (req, res, next) {
  console.log("啊啊啊，有人 404 了!!!");
  next();
});

// 所有的路由的下面
app.use(function (req, res, next) {
  // 表示前面的路由都找不到
  // http status code: 404
  res.status(404);
  res.render("404");
});

// 500 error
// 放在所有的路由的後面
// 這裡一定要有4個參數-->最後的錯誤處理
// express 預設的錯誤處理函式
app.use(function (err, req, res, next) {
  console.log("ERROR:", err);
  res.status(500);
  res.send("500 - Internal Sever Error 請洽系統管理員");
});

app.listen(3000, async () => {
  // 在 web server 開始的時候，去連線資料庫
  await connection.connectAsync();
  console.log(`我跑起來了喔 在 port 3000`);
});
