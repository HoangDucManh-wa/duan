"use strict";
// const p = new Promise((resolve, reject) => {
//   // thực hiện hành động nào đó
//   const success = true;
//   if (success) {
//     resolve("Hoàn thành!"); // khi thành công
//   } else {
//     reject("Thất bại!"); // khi lỗi
//   }
// });
const p = new Promise((resolve, error) => {
  error("That bai");
});

p.catch((p) => {
  console.error(p);
});
