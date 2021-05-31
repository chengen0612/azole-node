/*****************************************************************
 * 參考文章: https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
 *
 * 作法 1 跟 作法 2，為了不要互相干擾，我先把作法1 註解起來。
 *
 * 執行以下步驟:
 * 1. 執行看看這個程式，也就是目前的做法 2，觀察結果。
 * 2. 將作法2 中的 `// return doWorkPromise("寫功課", 5000, true);`  反註解，然後再執行一次，並且觀察結果。
 * 3. 將作法 2 整個註解掉，將作法1 反註解，執行程式，觀察結果。
 *
 * 最後，完成上述三個測試後，回答我以下兩個問題:
 * A. 比較上述三個測試的結果，你覺得差異為何？
 * B. 就程式結構來說，作法 1 跟 作法 2 哪個比較易讀跟好維護？
 *
 ******************************************************************/

let doWorkPromise = function (job, timer, success) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let dt = new Date();
      if (success) {
        // 成功
        return resolve(`完成工作: ${job} at ${dt.toISOString()}`);
      }
      reject(`!!工作失敗: ${job} at ${dt.toISOString()}`);
    }, timer);
  });
};

// 刷完牙 > 吃早餐 > 寫功課
// 作法 1
// doWorkPromise("刷牙", 2000, true)
//   .then((result) => {
//     // fulfilled 處理成功 resolve
//     console.log(result);
//     return doWorkPromise("吃早餐", 3000, false);
//   })
//   .then((result) => {
//     console.log(result);
//     return doWorkPromise("寫功課", 5000, true);
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     // rejected 處理失敗 reject
//     console.error("發生錯誤", err);
//   })
//   .finally(() => {
//     console.log("我是 Finally");
//   });

// 作法2
doWorkPromise("刷牙", 2000, true)
  .then(
    (result) => {
      // fulfilled 處理成功 resolve
      console.log(result);
      return doWorkPromise("吃早餐", 3000, false);
    },
    (reject) => {
      console.log("中途攔截A", reject);
    }
  )
  .then(
    (result) => {
      console.log(result);
      return doWorkPromise("寫功課", 5000, true);
    },
    (reject) => {
      console.log("中途攔截B", reject);
      // 試試看這行有註解 跟 沒註解的差異
      return doWorkPromise("寫功課", 5000, true);
    }
  )
  .then(
    (result) => {
      console.log(result);
    },
    (reject) => {
      console.log("中途攔截C", reject);
    }
  )
  .catch((err) => {
    // rejected 處理失敗 reject
    console.error("發生錯誤", err);
  })
  .finally(() => {
    console.log("我是 Finally");
  });
