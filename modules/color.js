// exports = module.exports = {}

exports.getColor = function () {
  return "RED";
};

module.exports = {
  setColor: function () {},
};

console.log(exports);
console.log("***************");
console.log(module.exports);

// return module.exports
