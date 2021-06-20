const express = require("express");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/register", (req, res) => {
  // TODO
  res.send("這裡是 POST Register");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

module.exports = router;
