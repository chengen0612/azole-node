let doWork = function (job, timer, cb) {
  setTimeout(() => {
    let dt = new Date();
    cb(null, `完成工作: ${job} at ${dt.toISOString()}`);
  }, timer);
};

// new Promise(function (resolve, reject) {});
//
let doWorkPromise = function (job, timer) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 成功
      let dt = new Date();
      resolve(`完成工作: ${job} at ${dt.toISOString()}`);
      // reject("故意錯誤");
      // 剛好我們這個情境不會失敗
      // if (err) {
      //   return reject(`工作失敗: ${job} at ${dt.toISOString()}`);
      // }
    }, timer);
  });
};

let brushPromise = doWorkPromise("刷牙", 2000);
console.log(brushPromise);

brushPromise
  .then((result) => {
    // fulfilled 處理成功 resolve
    console.log(result);
  })
  .catch((err) => {
    // rejected 處理失敗 reject
    console.error("發生錯誤", err);
  });
