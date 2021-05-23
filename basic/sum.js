function sum(n) {
  // O(1)
  // return ((1 + n) * n) / 2;

  // O(n)
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

console.log(sum(1)); // 1
console.log(sum(2)); // 3
console.log(sum(10)); // 55
console.log(sum(100000)); // 5000050000

console.time("SUM");
for (let i = 0; i <= 10000; i++) {
  sum(100000);
}
console.timeEnd("SUM");
