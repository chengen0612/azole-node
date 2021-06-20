const { response } = require("express");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("member");
});

module.exports = router;
