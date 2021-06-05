// let b = 0;  // --> 1

// // 2 new promise
// let testPromise = new Promise((resolve, reject) => {
//   // 3 做加法
//   let a = 2 + 3;
//   // 4 印出來
//   console.log("inside");

//   resolve(a);
// });
// // 5 promise 已經準備好了，可以給暗樁了

// // 6 印出 promise obj Promise { 5 }
// console.log(testPromise);
// // 7 「設定」排隊回來之後要幹嘛
// testPromise.then((result) => {
//   // 因為 11 所以這邊開始執行
//   b = result;
//   console.log(b);
// });
// // 8 印出來
// console.log(b);
// // 9 印出來
// console.log("outside");
// // 10. event loop 發現 stack 空，去 queue 搬東西
// // 11 event loop 搬 jab 回 stack

/*
因為 js is single-thread 
  -> 外包給暗樁(brower webapi, nodejs libuv)
  -> 有一個機制把控制權拿回來
    -> 所以，你會給暗樁一個回呼函示 callback
    -> 當暗樁把事情做完後，暗樁會把回呼函式放進 queue
       -> event loop 會檢查 stack 是否空了
          -> 如果是，那 event loop 會把 queue 裡的 cb 搬回 stack 準備執行
             ** queue 不止一個，是有優先順序的

因為 callback --> 產生 callback hell <--- Promise
在語法上、在程式碼，看起來沒那麼不直覺 then

*/

// console.log("Start 1");
// setTimeout(()=>{
//   console.log("Timeout 2 "); // --> Libuv
// }, 0);
// console.log("End 3");

const fs = require("fs");
let b = 0; // --> 1

// 2 new promise
let testPromise = new Promise((resolve, reject) => {
  // 3 做加法
  let a = 2 + 3;
  // 4 印出來
  console.log("inside");
  // 5 「開始」讀檔案
  fs.readFile("quiz.md", (err, result) => {
    console.log("讀完檔案");
    if (err) {
      reject(err);
    }
    resolve(result);
  });
});
//  6 promise 已經準備好了，可以給暗樁了

// 7 印出 promise obj Promise { pending }
console.log(testPromise);
// 8 「設定」排隊回來之後要幹嘛
testPromise.then((result) => {
  // 因為 93
  b = result;
  console.log("then");
});
// 9 印出來
console.log(b);
// 10 印出來
console.log("outside");

// 11 Event loop 就會去看 Q，因為檔案未讀完，所以 Q 空，沒東西搬
// 12 Event loop 就會去看 Q，因為檔案未讀完，所以 Q 空，沒東西搬
// ....
// 89 Event loop 就會去看 Q，因為檔案讀完，所以 Q 有東西了 --> readFile 的 cb
// 90 cb --> stack
// 91 因為成功，所以在 cb 裡呼叫了 resovle <-- promise
// 92 resovle -> micro queue
// 93 因為 stack 又空了，Event loop 就會去看 Q ，有 resovle -> 丟回 stack
