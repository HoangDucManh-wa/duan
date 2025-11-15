"use strict";

// Hàm tạo li mới với checkbox sát chữ
function createLi(text) {
  const li = document.createElement("li");
  const input = document.createElement("input");
  input.type = "checkbox";
  const textNode = document.createTextNode(text.trim());
  li.appendChild(textNode);
  li.appendChild(input);
  return li;
}

// Hàm xóa các mục đã check
function deleteChecked(ul, saveFn) {
  Array.from(ul.children).forEach((li) => {
    const checkbox = li.querySelector("input[type='checkbox']");
    if (checkbox.checked) li.remove();
  });
  saveFn();
}

// Hàm load dữ liệu từ localStorage
function loadList(ul, key) {
  const saved = localStorage.getItem(key);
  if (saved) ul.innerHTML = saved;
}

// ==========================
// UL1
// ==========================
const ul1 = document.getElementById("ul1");
const add1 = document.getElementById("add1");
const text1 = document.getElementById("text1");
const delete1 = document.getElementById("delete1");

function save1() {
  localStorage.setItem("key1", ul1.innerHTML);
}

add1.onclick = () => {
  if (text1.value.trim() === "") return;
  ul1.appendChild(createLi(text1.value));
  text1.value = "";
  save1();
};
delete1.onclick = () => deleteChecked(ul1, save1);

// ==========================
// UL2
// ==========================
const ul2 = document.getElementById("ul2");
const add2 = document.getElementById("add2");
const text2 = document.getElementById("text2");
const delete2 = document.getElementById("delete2");

function save2() {
  localStorage.setItem("key2", ul2.innerHTML);
}

add2.onclick = () => {
  if (text2.value.trim() === "") return;
  ul2.appendChild(createLi(text2.value));
  text2.value = "";
  save2();
};
delete2.onclick = () => deleteChecked(ul2, save2);

// ==========================
// UL3
// ==========================
const ul3 = document.getElementById("ul3");
const add3 = document.getElementById("add3");
const text3 = document.getElementById("text3");
const delete3 = document.getElementById("delete3");

function save3() {
  localStorage.setItem("key3", ul3.innerHTML);
}

add3.onclick = () => {
  if (text3.value.trim() === "") return;
  ul3.appendChild(createLi(text3.value));
  text3.value = "";
  save3();
};
delete3.onclick = () => deleteChecked(ul3, save3);

// ==========================
// UL4
// ==========================
const ul4 = document.getElementById("ul4");
const add4 = document.getElementById("add4");
const text4 = document.getElementById("text4");
const delete4 = document.getElementById("delete4");

function save4() {
  localStorage.setItem("key4", ul4.innerHTML);
}

add4.onclick = () => {
  if (text4.value.trim() === "") return;
  ul4.appendChild(createLi(text4.value));
  text4.value = "";
  save4();
};
delete4.onclick = () => deleteChecked(ul4, save4);

// ==========================
// Load dữ liệu khi mở trang
// ==========================
window.onload = () => {
  loadList(ul1, "key1");
  loadList(ul2, "key2");
  loadList(ul3, "key3");
  loadList(ul4, "key4");
};
