module.exports = {
  loginCheckMiddleware: function (req, res, next) {
    if (req.session.member) {
      next();
    } else {
      req.session.message = {
        title: "權限不足",
        text: "請先登入",
      };
      res.redirect("/auth/login");
    }
  },
};
