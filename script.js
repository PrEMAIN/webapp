// Текущие выбранные данные
let selectedDate = null;
let selectedSlot = null;

// Инициализация календаря
const datePicker = flatpickr("#datePicker", {
  dateFormat: "d.m.Y",
  locale: "ru",
  defaultDate: new Date(),
  onChange: function(selectedDates) {
    selectedDate = selectedDates[0].toISOString().split("T")[0];
    generateTimeGrid();
  }
});

// Генерация сетки времени
function generateTimeGrid() {
  const timeGrid = document.getElementById("timeGrid");
  timeGrid.innerHTML = "";

  // Создаём блоки времени с 8:00 до 24:00
  for (let hour = 8; hour < 24; hour++) {
    const timeBlock = document.createElement("div");
    timeBlock.className = "time-block";
    
    const timeHeader = document.createElement("div");
    timeHeader.className = "time-header";
    timeHeader.innerHTML = `
      <span>${hour}:00 - ${hour+1}:00</span>
      <button class="add-btn" data-hour="${hour}">+</button>
    `;
    
    const tasksContainer = document.createElement("div");
    tasksContainer.className = "tasks-container";
    
    const taskList = document.createElement("ul");
    taskList.className = "task-list";
    tasksContainer.appendChild(taskList);
    
    timeBlock.appendChild(timeHeader);
    timeBlock.appendChild(tasksContainer);
    timeGrid.appendChild(timeBlock);
    
    // Обработчик клика на заголовок
    timeHeader.addEventListener("click", function() {
      tasksContainer.classList.toggle("open");
    });
    
    // Обработчик кнопки добавления
    timeHeader.querySelector(".add-btn").addEventListener("click", function(e) {
      e.stopPropagation();
      selectedSlot = `${hour}:00 - ${hour+1}:00`;
      document.getElementById("selectedTimeSlot").textContent = selectedSlot;
      document.getElementById("taskModal").style.display = "block";
      document.getElementById("taskInput").focus();
    });
  }

  loadTasks();
}

// Исправленная функция saveTask
function saveTask() {
  const text = document.getElementById("taskInput").value.trim();
  const category = document.getElementById("categorySelect").value;

  if (!text) {
    alert("Введите название задачи!");
    return;
  }

  const tasks = JSON.parse(localStorage.getItem("tasks") || "{}");
  
  // Если для выбранной даты ещё нет задач, создаём пустой массив
  if (!tasks[selectedDate]) {
    tasks[selectedDate] = [];
  }
  
  // Добавляем новую задачу
  tasks[selectedDate].push({ 
    text, 
    done: false, 
    category,
    timeSlot: selectedSlot
  });
  
  // Сохраняем обновлённый список задач
  localStorage.setItem("tasks", JSON.stringify(tasks));
  
  // Закрываем модальное окно
  closeModal();
  
  // Полностью пересоздаём сетку времени с обновлёнными данными
  generateTimeGrid();
}

// Исправленная функция loadTasks
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "{}");
  const dateTasks = tasks[selectedDate] || [];

  dateTasks.forEach(task => {
    const hour = parseInt(task.timeSlot.split(":")[0]);
    const timeBlocks = document.querySelectorAll(".time-block");
    const targetBlock = timeBlocks[hour - 8];
    
    if (targetBlock) {
      const taskList = targetBlock.querySelector(".task-list");
      const taskItem = document.createElement("li");
      taskItem.className = `task-item ${task.category}`;
      taskItem.innerHTML = `
        <input type="checkbox" ${task.done ? 'checked' : ''} 
               onchange="toggleTask('${selectedDate}', ${dateTasks.indexOf(task)})">
        <span class="${task.done ? 'completed' : ''}">${task.text}</span>
        <button class="delete-btn" onclick="deleteTask(event, '${selectedDate}', ${dateTasks.indexOf(task)})">❌</button>
      `;
      taskList.appendChild(taskItem);
      
      // Автоматически раскрываем блок, если там есть задачи
      targetBlock.querySelector(".tasks-container").classList.add("open");
    }
  });
}

// Удаление задачи
function deleteTask(event, date, index) {
  event.stopPropagation();
  if (confirm("Удалить эту задачу?")) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[date].splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    generateTimeGrid();
  }
}

// Управление модальным окном
function closeModal() {
  document.getElementById("taskModal").style.display = "none";
  document.getElementById("taskInput").value = "";
}

// Переключение темы
function toggleTheme() {
  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  document.getElementById("themeToggle").textContent = newTheme === "dark" ? "☀️" : "🌙";
}

// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", () => {
  // Установка темы
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", savedTheme);
  document.getElementById("themeToggle").textContent = savedTheme === "dark" ? "☀️" : "🌙";
  
  // Обработчик кнопки темы
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  
  // Установка текущей даты
  selectedDate = new Date().toISOString().split("T")[0];
  generateTimeGrid();
});