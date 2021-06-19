const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

router.get("/stocks", async (req, res) => {
  let queryResults = await connection.queryAsync("SELECT * FROM stock;");

  res.json(queryResults);
});

module.exports = router;
