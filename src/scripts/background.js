chrome.alarms.create('pomodoroTimer', {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'pomodoroTimer') {
    chrome.storage.local.get(['timer', 'isRunning'], response => {
      if (response.isRunning) {
        let timer = response.timer + 1;
        let isRunning = true;
        if (timer === 10) {
          this.registration.showNotification('Pomodoro Timer', {
            body: '25 minutes has passed!',
            icon: '../../images/icon.png',
          });
          timer = 0;
          isRunning = false;
        }
        chrome.storage.local.set({
          timer,
          isRunning,
        });
      }
    });
  }
});

chrome.storage.local.get(['timer', 'isRunning'], response => {
  chrome.storage.local.set({
    timer: 'timer' in response ? response.timer : 0,
    isRunning: 'isRunning' in response ? response.isRunning : false,
  });
});
