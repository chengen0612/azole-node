const express = require("express");
const router = express.Router();

const connection = require("../utils/db");

router.get("/", async (req, res) => {
  let queryResults = await connection.queryAsync("SELECT * FROM stock;");
  res.render("stock/list", {
    stocks: queryResults,
  });
});
// TODO:
// - 模組化 v
// - 股票標題 v
// - 分頁
// - 檢查這個股票代碼是否有效（有在我們的列表裡面） v

// 作法1: /:stockCode?page=2 第二頁
// 作法2: /:stockCode/:page
router.get("/:stockCode", async (req, res, next) => {
  // 檢查是否有這個代碼
  let stock = await connection.queryAsync(
    "SELECT * FROM stock WHERE stock_id=?;",
    req.params.stockCode
  );

  if (stock.length === 0) {
    // 查不到代碼 not found
    // 因為是 async 所以不能直接丟 ERROR
    // throw new Error("Not Found");
    return next(); // ---> 落入 404 那個中間件
  }
  stock = stock[0];

  // 分頁
  // 一頁有幾筆？
  // 現在在第幾頁？
  // 總共有多少筆數？ --> 總頁數

  // 總共有幾筆？？
  let count = await connection.queryAsync(
    "SELECT COUNT(*) as total FROM stock_price WHERE stock_id=?;",
    req.params.stockCode
  );
  // console.log(count);
  // [ RowDataPacket { total: 74 } ]
  const total = count[0].total;
  const perPage = 10; // 一頁 10 筆
  const lastPage = Math.ceil(total / perPage);

  // 現在在第幾頁？
  // http://localhost:3001/stock/2330
  const currentPage = req.query.page || 1;
  const offset = (currentPage - 1) * perPage;
  // page 1 -> 0
  // page 2 -> 10
  // page 3 -> 20

  let queryResults = await connection.queryAsync(
    "SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date LIMIT ? OFFSET ?;",
    [req.params.stockCode, perPage, offset]
  );

  res.render("stock/detail", {
    stock,
    stockPrices: queryResults,
    pagination: {
      lastPage,
      currentPage,
      total,
    },
  });
});

module.exports = router;
