"use strict";
//1
const ul1 = document.getElementById("ul1");
const add1 = document.getElementById("add1");
const text1 = document.getElementById("text1");
const delete1 = document.getElementById("delete1");
function save1() {
  localStorage.setItem("key1", ul1.innerHTML);
}
add1.onclick = () => {
  const li = document.createElement("li");
  const input = document.createElement("input");
  input.type = "checkbox";
  li.textContent = text1.value;
  li.appendChild(input);
  ul1.appendChild(li);
  save1();
};
delete1.onclick = () => {
  const arr = Array.from(ul1.children);
  arr.forEach((x) => {
    const input = x.querySelector("input[type='checkbox']");
    if (input.checked) {
      x.remove();
    }
  });
  save1();
};
//2
const ul2 = document.getElementById("ul2");
const add2 = document.getElementById("add2");
const text2 = document.getElementById("text2");
const delete2 = document.getElementById("delete2");
function save2() {
  localStorage.setItem("key2", ul2.innerHTML);
}
add2.onclick = () => {
  const li = document.createElement("li");
  const input = document.createElement("input");
  input.type = "checkbox";
  li.textContent = text2.value;
  li.appendChild(input);
  ul2.appendChild(li);
  save2();
};
delete2.onclick = () => {
  const arr = Array.from(ul2.children);
  arr.forEach((x) => {
    const input = x.querySelector("input[type='checkbox']");
    if (input.checked) {
      x.remove();
    }
  });
  save2();
};
//3
const ul3 = document.getElementById("ul3");
const add3 = document.getElementById("add3");
const text3 = document.getElementById("text3");
const delete3 = document.getElementById("delete3");
function save3() {
  localStorage.setItem("key3", ul3.innerHTML);
}
add3.onclick = () => {
  const li = document.createElement("li");
  const input = document.createElement("input");
  input.type = "checkbox";
  li.textContent = text3.value;
  li.appendChild(input);
  ul3.appendChild(li);
  save3();
};
delete3.onclick = () => {
  const arr = Array.from(ul3.children);
  arr.forEach((x) => {
    const input = x.querySelector("input[type='checkbox']");
    if (input.checked) {
      x.remove();
    }
  });
  save3();
};
//
window.onload = () => {
  const key1 = localStorage.getItem("key1");
  const key2 = localStorage.getItem("key2");
  const key3 = localStorage.getItem("key3");
  ul1.innerHTML = key1;
  ul2.innerHTML = key2;
  ul3.innerHTML = key3;
};
