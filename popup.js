document.addEventListener('DOMContentLoaded', function() {
  const searchPhraseInput = document.getElementById('searchPhrase');
  const intervalInput = document.getElementById('interval');
  const startStopButton = document.getElementById('startStopButton');
  const statusParagraph = document.getElementById('status');

  // Load saved settings when popup opens
  chrome.storage.local.get(['phrase', 'interval', 'isRunning'], function(data) {
    if (data.phrase) searchPhraseInput.value = data.phrase;
    if (data.interval) intervalInput.value = data.interval;
    if (data.isRunning) {
      startStopButton.textContent = 'Stop';
      statusParagraph.textContent = 'Status: Running';
    } else {
      startStopButton.textContent = 'Start';
      statusParagraph.textContent = 'Status: Stopped';
    }
  });

  startStopButton.addEventListener('click', function() {
    const isRunning = startStopButton.textContent === 'Stop';
    if (isRunning) {
      // Stop the alarm
      chrome.alarms.clear('googleSearchAlarm');
      startStopButton.textContent = 'Start';
      statusParagraph.textContent = 'Status: Stopped';
      chrome.storage.local.set({isRunning: false});
    } else {
      // Start the alarm
      const phrase = searchPhraseInput.value;
      const interval = parseInt(intervalInput.value, 10);
      if (!phrase || interval < 5) {
        statusParagraph.textContent = 'Error: Please enter a search phrase and an interval of at least 5 seconds.';
        return;
      }
      chrome.storage.local.set({phrase, interval, isRunning: true}, function() {
        chrome.alarms.create('googleSearchAlarm', { periodInMinutes: interval / 60 });
        startStopButton.textContent = 'Stop';
        statusParagraph.textContent = `Status: Running every ${interval} seconds`;
      });
    }
  });
});
