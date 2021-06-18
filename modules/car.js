// 如果沒有透過 exports 或 module.exports 去暴露資訊的，
// 其他的就都是 private

const colors = require("./color");
colors.color1 = "AAAAAA";

const name = "AA";
const car = {
  brand: "Ford",
  color: "blue",
};

exports.name = "Ashley";

exports.getColor = function () {
  return car.color;
};

exports.setColor = function (color) {
  if (color == "Yellow" || color == "Red") {
    car.color = color;
  }
  // TODO: 不符合的，不給改
};

module.exports.age = 25;

// exports.car = car;

// module.exports = {};
