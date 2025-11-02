"use strict";
//Khai bao
const important = document.getElementById("important");
const lesstime = document.getElementById("lesstime");
const add1 = document.getElementById("add1");
const xoa_important = document.getElementById("xoa_important");
const delete2 = document.getElementById("delete2");
const add2 = document.getElementById("add2");
const add_capbach = document.getElementById("add_capbach");

//ham viet hoa
function viethoa(text) {
  if (!text) {
    return "";
  } else {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}

// ==========================
// Lưu và tải dữ liệu
// ==========================
function saveData() {
  const data = {
    important: Array.from(important.children).map((li) =>
      li.firstChild.textContent.trim()
    ),
    lesstime: Array.from(lesstime.children).map((li) =>
      li.firstChild.textContent.trim()
    ),
  };
  localStorage.setItem("todoData", JSON.stringify(data));
}

function loadData() {
  const saved = localStorage.getItem("todoData");
  // Xóa nội dung hiện có trước khi khôi phục để tránh duplicate
  important.innerHTML = "";
  lesstime.innerHTML = "";

  if (!saved) return;

  const data = JSON.parse(saved);

  // Khôi phục danh sách quan trọng
  data.important.forEach((task) => {
    let li = document.createElement("li");
    // text node để tách rõ text và checkbox (không dùng li.textContent rồi append checkbox vì .textContent gộp hết)
    const textNode = document.createTextNode(task);
    li.appendChild(textNode);
    let input = document.createElement("input");
    input.type = "checkbox";
    li.appendChild(input);
    important.appendChild(li);
  });

  // Khôi phục danh sách cấp bách
  data.lesstime.forEach((task) => {
    let li = document.createElement("li");
    const textNode = document.createTextNode(task);
    li.appendChild(textNode);
    let input = document.createElement("input");
    input.type = "checkbox";
    li.appendChild(input);
    lesstime.appendChild(li);
  });
}

// ==========================
// Các hành động thêm / xóa
// ==========================
//1:Cong viec quan trong
//ham xoa
xoa_important.onclick = () => {
  let importantArray = Array.from(important.children);
  importantArray.forEach((x) => {
    let hehe = x.querySelector("input[type='checkbox']");
    if (hehe && hehe.checked) {
      x.remove();
    }
  });
  saveData(); // Lưu sau khi xóa
};

//them
add1.onclick = () => {
  let node = document.getElementById("add_important");
  if (node.value.trim() !== "") {
    let li = document.createElement("li");
    const textNode = document.createTextNode(viethoa(node.value.trim()));
    li.appendChild(textNode);
    let input = document.createElement("input");
    input.type = "checkbox";
    li.appendChild(input);
    important.appendChild(li);
    node.value = "";
    saveData(); // Lưu sau khi thêm
  }
};

//2 Cong viec cap bach
//xoa
delete2.onclick = () => {
  const arraylesstime = Array.from(lesstime.children);
  arraylesstime.forEach((x) => {
    const hehe = x.querySelector("input[type='checkbox']");
    if (hehe && hehe.checked) {
      x.remove();
    }
  });
  saveData(); // Lưu sau khi xóa
};

//them
add2.onclick = () => {
  if (add_capbach.value.trim() !== "") {
    let li = document.createElement("li");
    const textNode = document.createTextNode(viethoa(add_capbach.value.trim()));
    li.appendChild(textNode);
    let input = document.createElement("input");
    input.type = "checkbox";
    li.appendChild(input);
    lesstime.appendChild(li);
    add_capbach.value = "";
    saveData(); // Lưu sau khi thêm
  }
};

// load khi mở trang
loadData();
