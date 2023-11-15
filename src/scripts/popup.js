let tasks = [];

const addTask = () => {
  const taskNum = tasks.length;
  tasks.push('');
  renderTask(taskNum);
  saveTasks();
};

function updateTime() {
  chrome.storage.local.get(
    ['timer', 'timeOption', 'isRunning'],
    ({ timer, timeOption, isRunning }) => {
      const time = document.getElementById('time');
      const minutes = `${timeOption - Math.ceil(timer / 60)}`.padStart(2, '0');
      const seconds = `${(60 - (timer % 60)) % 60}`.padStart(2, '0');
      time.textContent = `${minutes}:${seconds}`;
      startTimerBtn.textContent = isRunning ? 'Pause Timer' : 'Start Timer';
    },
  );
}

updateTime();
setInterval(updateTime, 1000);

const startTimerBtn = document.getElementById('start-timer-btn');
startTimerBtn.addEventListener('click', () => {
  chrome.storage.local.get(['isRunning'], ({ isRunning }) => {
    chrome.storage.local.set({ isRunning: !isRunning }, () => {
      startTimerBtn.textContent = !isRunning ? 'Pause Timer' : 'Start Timer';
    });
  });
});

const resetTimerBtn = document.getElementById('reset-timer-btn');
resetTimerBtn.addEventListener('click', () => {
  chrome.storage.local.set({ timer: 0, isRunning: false }, () => {
    startTimerBtn.textContent = 'Start Timer';
  });
});

const addTaskBtn = document.getElementById('add-task-btn');
addTaskBtn.addEventListener('click', addTask);

chrome.storage.sync.get(['tasks'], ({ tasks: storedTasks }) => {
  tasks = storedTasks || [];
  renderTasks();
});

const saveTasks = () => {
  chrome.storage.sync.set({ tasks });
};

const renderTask = taskNum => {
  const taskRow = document.createElement('div');

  const text = document.createElement('input');
  text.type = 'text';
  text.placeholder = 'Enter a task...';
  text.value = tasks[taskNum];
  text.className = 'task-input';
  text.addEventListener('change', () => {
    tasks[taskNum] = text.value;
    saveTasks();
  });

  const deleteBtn = document.createElement('input');
  deleteBtn.type = 'button';
  deleteBtn.value = 'X';
  deleteBtn.className = 'task-delete';
  deleteBtn.addEventListener('click', () => deleteTask(taskNum));

  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);

  document.getElementById('task-container').appendChild(taskRow);
};

const deleteTask = taskNum => {
  tasks.splice(taskNum, 1);
  renderTasks();
  saveTasks();
};

const renderTasks = () => {
  const taskContainer = document.getElementById('task-container');
  taskContainer.textContent = '';
  tasks.forEach((taskText, taskNum) => renderTask(taskNum));
};
