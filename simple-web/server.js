// http 是 NodeJS 內建的 web server，所以不用安裝
// https://nodejs.org/docs/latest-v14.x/api/http.html
const http = require("http");
const { URL } = require("url");
const fs = require("fs/promises");

// createServer(Listener)
// Listener(request, response) 負責處理進來的連線
// request 是請求物件
// response 是回覆物件
const server = http.createServer(async (req, res) => {
  console.log("有連線進來了");
  console.log(req.url);

  // 將 url 一般化，移除他的 query string、非必要的結尾斜線，並且一率小寫
  const path = req.url.replace(/\/?(?:\?.*)?$/, "").toLocaleLowerCase();
  console.log(`path:${path}`);

  // 處理 query string
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(url.searchParams);

  res.statusCode = 200; // 2xx, 3xx, 4xx, 5xx
  res.setHeader("Content-Type", "text/plain;charset=UTF-8");

  // 路由 router
  switch (path) {
    case "":
      res.end("Hi 這是首頁 我是小賴");
      break;
    case "/test":
      res.setHeader("Content-Type", "text/html;charset=UTF-8");
      let content = await fs.readFile("test.html");
      res.end(content);
      break;
    case "/about":
      // 把 query string 抓出來用
      // set vs get 存取運算子
      let name = url.searchParams.get("name") || "網友";
      res.end(`Hi, ${name} 這是關於我們`);
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
