// http 是 NodeJS 內建的 web server，所以不用安裝
// https://nodejs.org/docs/latest-v14.x/api/http.html
const http = require("http");

// createServer(Listener)
// Listener(request, response) 負責處理進來的連線
// request 是請求物件
// response 是回覆物件
const server = http.createServer((req, res) => {
  console.log("有連線進來了");
  console.log(req.url);

  res.statusCode = 200; // 2xx, 3xx, 4xx, 5xx
  res.setHeader("Content-Type", "text/plain;charset=UTF-8");

  switch (req.url) {
    case "/":
      res.end("Hi 這是首頁 我是小賴");
      break;
    case "/test":
      res.end("這是測試頁面");
      break;
    case "/about":
      res.end("這是關於我們");
      break;
    default:
      res.writeHead(404);
      res.end("Not Found");
  }
});

// port
server.listen(3000, () => {
  console.log("我跑起來了喔，我要收 3000 port");
});

// PHP --> 搭配 web server （apache or nginx)
// NodeJS 直接開發一個 web server
