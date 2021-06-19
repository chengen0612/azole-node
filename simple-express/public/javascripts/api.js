// TODO jquery.ajax 去取得 api/stocks 的資料

$(function () {
  // XMLHttpRequest

  // jquery ajax
  $.ajax({
    type: "GET",
    // http://localhost:3000 ==> /api/stocks 相對位置
    url: "/api/stocks",
  }).done(function (data) {
    console.log(data);
  });

  // axios promised based
  // then or async/await
  axios.get("/api/stocks").then((res) => {
    console.log(res.data);
  });

  // fetch 也是 promised based
  // then or async/await
  fetch("/api/stocks")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
    });
});
