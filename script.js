// Загрузка задач при открытии
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('dateInput');
    // Устанавливаем сегодняшнюю дату по умолчанию
    dateInput.valueAsDate = new Date();
    updateTasks();
  });
  
  // Добавление задачи
  function addTask() {
    const date = document.getElementById('dateInput').value;
    const text = document.getElementById('taskInput').value.trim();
    
    if (!text) return; // Не добавляем пустые задачи
    
    const tasks = JSON.parse(localStorage.getItem('tasks') || '{}');
    if (!tasks[date]) tasks[date] = [];
    tasks[date].push({ text, done: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    document.getElementById('taskInput').value = ''; // Очищаем поле ввода
    updateTasks();
  }
  
  // Обновление списка задач
  function updateTasks() {
    const date = document.getElementById('dateInput').value;
    const taskList = document.getElementById('taskList');
    const currentDateElement = document.getElementById('currentDate');
    
    currentDateElement.textContent = date;
    taskList.innerHTML = '';
    
    const tasks = JSON.parse(localStorage.getItem('tasks') || '{}')[date] || [];
    
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.onchange = () => toggleTask(date, index);
      
      const text = document.createTextNode(task.text);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '❌';
      deleteBtn.onclick = () => deleteTask(date, index);
      deleteBtn.style.marginLeft = 'auto';
      deleteBtn.style.background = 'transparent';
      deleteBtn.style.border = 'none';
      
      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }
  
  // Отметка задачи как выполненной/невыполненной
  function toggleTask(date, index) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks[date][index].done = !tasks[date][index].done;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Удаление задачи
  function deleteTask(date, index) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks[date].splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTasks();
  }