const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
const fileInput = document.getElementById("file-input");
const urlInput = document.getElementById("url-input");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
tasks.forEach(task => renderTask(task));

function updateCounters() {
  const completedTasks = document.querySelectorAll(".completed").length;
  const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;
  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = uncompletedTasks;
}

function addTask() {
  const taskText = inputBox.value.trim();
  const file = fileInput.files[0];
  const url = urlInput.value.trim();

  if (!taskText && !file && !url) {
    alert("Please add a task, a file, or a reference link.");
    return;
  }

  const task = { text: taskText, url: url, file: null, completed: false };
  if (file) task.file = { name: file.name, type: file.type, url: URL.createObjectURL(file) };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTask(task);

  inputBox.value = "";
  fileInput.value = "";
  urlInput.value = "";
  updateCounters();
}

function renderTask(task) {
  const li = document.createElement("li");

  // Checkbox + text
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  if (task.completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = task.text || "Attachment/Reference";

  label.appendChild(checkbox);
  label.appendChild(span);
  li.appendChild(label);

  // File
  if (task.file) {
    if (task.file.type.startsWith("image")) {
      const img = document.createElement("img");
      img.src = task.file.url;
      li.appendChild(img);
    } else {
      const a = document.createElement("a");
      a.href = task.file.url;
      a.target = "_blank";
      a.textContent = task.file.name;
      li.appendChild(a);
    }
  }

  // URL reference
  if (task.url) {
    const link = document.createElement("a");
    link.href = task.url;
    link.target = "_blank";
    link.textContent = "Reference Link";
    li.appendChild(link);
  }

  // Buttons
  const editBtn = document.createElement("span");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";
  const deleteBtn = document.createElement("span");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";

  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  // Timestamp
  const timestamp = document.createElement("div");
  timestamp.style.fontSize = "12px";
  timestamp.style.color = "lightgray";
  timestamp.textContent = "Added: " + new Date().toLocaleString();
  li.appendChild(timestamp);

  // Event listeners
  checkbox.addEventListener("click", () => {
    li.classList.toggle("completed", checkbox.checked);
    task.completed = checkbox.checked;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateCounters();
  });

  editBtn.addEventListener("click", () => {
    const update = prompt("Edit task:", span.textContent);
    if (update !== null) {
      span.textContent = update;
      task.text = update;
      task.completed = false;
      checkbox.checked = false;
      li.classList.remove("completed");
      localStorage.setItem("tasks", JSON.stringify(tasks));
      updateCounters();
    }
  });

  deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this task?")) {
      li.remove();
      tasks = tasks.filter(t => t !== task);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      updateCounters();
    }
  });

  listContainer.appendChild(li);
  updateCounters();
}

function deleteAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    listContainer.innerHTML = "";
    tasks = [];
    localStorage.removeItem("tasks");
    updateCounters();
  }
}

