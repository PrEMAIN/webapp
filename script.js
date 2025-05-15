// Инициализация календаря
const datePicker = flatpickr("#datePicker", {
  dateFormat: "d.m.Y",
  locale: "ru",
  defaultDate: new Date(),
  onChange: updateTasks
});

// Текущий фильтр задач
let currentFilter = "all";

// Загрузка при открытии
document.addEventListener("DOMContentLoaded", () => {
  updateTasks();
  loadTheme();
});

// Добавление задачи
function addTask() {
  const date = datePicker.selectedDates[0]?.toISOString().split("T")[0];
  const text = document.getElementById("taskInput").value.trim();

  if (!date || !text) return;

  const tasks = JSON.parse(localStorage.getItem("tasks") || "{}");
  if (!tasks[date]) tasks[date] = [];
  tasks[date].push({ text, done: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById("taskInput").value = "";
  updateTasks();
}

// Обновление списка задач
function updateTasks() {
  const date = datePicker.selectedDates[0]?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0];
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const tasks = JSON.parse(localStorage.getItem("tasks") || "{}")[date] || [];

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "all") return true;
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "completed") return task.done;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = "<p>Нет задач</p>";
    return;
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.onchange = () => toggleTask(date, index);

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    if (task.done) taskText.classList.add("completed");

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "❌";
    deleteBtn.onclick = () => {
      if (confirm("Удалить задачу?")) deleteTask(date, index);
    };

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Фильтрация задач
function filterTasks(filter) {
  currentFilter = filter;
  document.querySelectorAll(".task-filters button").forEach(btn => {
    btn.classList.toggle("active", btn.textContent.toLowerCase().includes(filter));
  });
  updateTasks();
}

// Переключение статуса задачи
function toggleTask(date, index) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks[date][index].done = !tasks[date][index].done;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateTasks();
}

// Удаление задачи
function deleteTask(date, index) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks[date].splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateTasks();
}

// Темная тема
function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", savedTheme);
  document.getElementById("themeToggle").textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

document.getElementById("themeToggle").addEventListener("click", () => {
  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  document.getElementById("themeToggle").textContent = newTheme === "dark" ? "☀️" : "🌙";
});