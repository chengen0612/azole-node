// new Promise(function (resolve, reject) {});
// Promise 是一個表示非同步運算的「最終」「完成或失敗」的「物件」
//    最終成功 --人--> resolve --Promise--> then
//    最終失敗 --人--> reject  --Promise--> catch
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
// 1. await 只能用在 async function 裡
async function manager() {
  try {
    let result = await doWorkPromise("刷完牙", 2000, true);
    console.log("await", result);

    result = await doWorkPromise("吃早餐", 2500, true);
    console.log("await", result);

    result = await doWorkPromise("寫功課", 3000, true);
    console.log("await", result);
  } catch (err) {
    console.log("錯誤", err);
  } finally {
    console.log("最後做完了");
  }
}

let dt = new Date();
console.log(`開始工作 at ${dt.toISOString()}`);

manager();
