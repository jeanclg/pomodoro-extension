const elements = {
  addTaskBtn: document.getElementById('add-task-btn'),
  taskContainer: document.getElementById('task-container'),
  startTimerBtn: document.getElementById('start-timer-btn'),
  resetTimerBtn: document.getElementById('reset-timer-btn'),
};

let tasks = [];

chrome.storage.sync.get(['tasks'], response => {
  tasks = response.tasks ? response.tasks : [];
  renderTasks();
});

const renderTask = taskNum => {
  const row = document.createElement('div');

  const text = document.createElement('input');
  text.type = 'text';
  text.placeholder = 'Enter a task...';
  text.value = tasks[taskNum];
  text.addEventListener('change', () => {
    tasks[taskNum] = text.value;
    saveTasks();
  });

  const deleteBtn = document.createElement('input');
  deleteBtn.type = 'button';
  deleteBtn.value = 'X';
  deleteBtn.addEventListener('click', () => {
    deleteTask(taskNum);
  });

  row.appendChild(text);
  row.appendChild(deleteBtn);

  elements.taskContainer.appendChild(row);
};

const saveTasks = () => {
  chrome.storage.sync.set({ tasks });
};

const addTask = () => {
  const taskNum = tasks.length;
  tasks.push('');
  renderTask(taskNum);
};

const deleteTask = taskNum => {
  tasks.splice(taskNum, 1);
  renderTasks();
  saveTasks();
};

const renderTasks = () => {
  taskContainerCurrent = document.getElementById('task-container');
  taskContainerCurrent.textContent = '';
  tasks.forEach((taskText, taskNum) => {
    renderTask(taskNum);
  });
};

elements.addTaskBtn.addEventListener('click', addTask);

elements.startTimerBtn.addEventListener('click', () => {
  chrome.storage.local.get(['isRunning'], response => {
    chrome.storage.local.set(
      {
        isRunning: !response.isRunning,
      },
      () => {
        elements.startTimerBtn.textContent = !response.isRunning ? 'Pause Timer' : 'Start Timer';
      },
    );
  });
});

elements.resetTimerBtn.addEventListener('click', () => {
  chrome.storage.local.set(
    {
      timer: 0,
      isRunning: false,
    },
    () => {
      elements.startTimerBtn.textContent = 'Start Timer';
    },
  );
});
