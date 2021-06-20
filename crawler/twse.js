const axios = require("axios");
const moment = require("moment");
const BusinessDay = moment().format("YYYYMMDD");

const twseUrl = "https://www.twse.com.tw";

exports.queryStockName = async function (stockCode) {
  let response = await axios.get(
    `${twseUrl}/zh/api/codeQuery?query=${stockCode}`
  );
  let stockNumber = response.data.suggestions.shift();
  let stockNoName = stockNumber.split("\t");

  if (stockNoName.length > 1) {
    return stockNoName;
  } else {
    return null;
  }
};

exports.queryStockData = async function (stockCode) {
  let analysisTransaction = await axios.get(
    `${twseUrl}/exchangeReport/STOCK_DAY`,
    {
      params: {
        response: "json",
        date: BusinessDay,
        stockNo: stockCode,
      },
    }
  );
  if (analysisTransaction.data.stat !== "OK") {
    throw "查詢此筆失敗";
  }

  return analysisTransaction.data.data.map((item) => {
    item = item.map((value) => {
      return value.replace(/,/g, "");
    });
    //取出資料後，將日期轉換成資料庫的格式
    //文件寫法原本是replace( / 要轉換的符號 /g, )=>(/ //g,) ， 但因為//是註解，電腦無法判斷，故再中間的轉換符號再+\
    //replace轉換替代完後，parseInt()將字串轉成整數10進位 後 + 19110000
    //再由moment() 以 format()格式轉換成日期格式
    item[0] = parseInt(item[0].replace(/\//g, ""), 10) + 19110000; // 20210601
    item[0] = moment(item[0], "YYYYMMDD").format("YYYY-MM-DD"); // 2021-06-01
    //unshift()=>把data股票代號加入到item陣列的最前端
    item.unshift(stockCode);
    return item;
  });
};
