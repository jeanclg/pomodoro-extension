chrome.alarms.create('pomodoroTimer', {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'pomodoroTimer') {
    chrome.storage.local.get(['timer', 'isRunning'], response => {
      if (response.isRunning) {
        const timer = response.timer + 1;
        console.log(timer);
        chrome.storage.local.set({
          timer,
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
