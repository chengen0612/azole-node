const express = require("express");
const router = express.Router();
const connection = require("../utils/db");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const path = require("path");
const multer = require("multer");
// 設定上傳檔案的儲存地方、方式
const myStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // routes/auth.js -> 現在的位置
    // public/uploads -> 希望找到的位置
    // /routes/../public/uploads
    cb(null, path.join(__dirname, "../", "public", "uploads"));
  },
  filename: function (req, file, cb) {
    // 抓出副檔名
    const ext = file.originalname.split(".").pop();
    // 組合出自己想要的檔案名稱
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});
// 要用 multer 來做一個上傳工具
const uploader = multer({
  storage: myStorage,
  fileFilter: function (req, file, cb) {
    // console.log(file);
    if (file.mimetype !== "image/jpeg") {
      return cb(new Error("不合法的 file type"), false);
    }
    // file.originalname: Name of the file on the user's computer
    // 101.jpeg
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("是不合格的副檔名"));
    }
    // 檔案ＯＫ, 接受這個檔案
    cb(null, true);
  },
  limits: {
    // 限制檔案的上限 1 M
    fileSize: 1024 * 1024,
  },
});

router.get("/register", (req, res) => {
  res.render("auth/register");
});

// 註冊表單資料的驗證規則
const registerRules = [
  body("email").isEmail().withMessage("請正確輸入 Email 格式"),
  body("password").isLength({ min: 6 }),
  body("confirmPassword").custom((value, { req }) => {
    return value === req.body.password;
  }),
];

// 中間函式只有這個路由需要用到？
router.post(
  "/register",
  uploader.single("photo"),
  registerRules,
  async (req, res, next) => {
    // 加上中間函式(express.urlencoded)的設定
    // 就可以透過 req.body 來取得 post 資料
    console.log(req.body);

    // 後端工程師絕對不能相信來自前端的資料，所以要做驗證
    const validateResult = validationResult(req);
    if (!validateResult.isEmpty()) {
      // 不是空的，就是有問題
      // 暫時先這樣做
      return next(new Error("註冊表單資料有問題"));
    }

    // 先檢查這個 email 是否已經註冊過
    let checkResult = await connection.queryAsync(
      "SELECT * FROM members WHERE email = ?",
      req.body.email
    );
    if (checkResult.length > 0) {
      // 暫時先這樣做
      return next(new Error("已經註冊過了"));
    }

    // 取得上傳檔案
    console.log(req.file);
    // {
    //   fieldname: 'photo',
    //   originalname: '80266.jpg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg',
    //   destination: '..../simple-express/public/uploads',
    //   filename: 'photo-1624162373617.jpg',
    //   path: '..../simple-express/public/uploads/photo-1624162373617.jpg',
    //   size: 49405
    // }

    // 如果沒有註冊過，就儲存資料
    // 10: salt
    // bcrypt.hash(req.body.password, 10)
    let result = await connection.queryAsync(
      "INSERT INTO members (email, password, name, photo) VALUES (?);",
      [
        [
          req.body.email,
          await bcrypt.hash(req.body.password, 10),
          req.body.name,
          `/uploads/${req.file.filename}`,
        ],
      ]
    );

    res.send("恭喜，註冊成功");
  }
);

router.get("/login", (req, res) => {
  res.render("auth/login");
});

module.exports = router;
