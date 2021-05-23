function sum(n) {
  // O(1) 常數
  // return ((1 + n) * n) / 2;

  // O(n) 變數 -> 時間上複雜度會隨著 n 而成長
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += 1;
  }
  return sum;
}

// console.log(sum(1)); // 1
// console.log(sum(2)); // 3
// console.log(sum(10)); // 55
console.log(sum(100000)); // 5000050000
console.time("SUM1");
for (let i = 0; i <= 10000; i++) {
  sum(2);
}
console.timeEnd("SUM1");

console.time("SUM");
for (let i = 0; i <= 10000; i++) {
  sum(100000);
}
console.timeEnd("SUM");
