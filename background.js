chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'googleSearchAlarm') {
    chrome.storage.local.get('phrase', function(data) {
      const phrase = data.phrase;
      if (phrase) {
        const query = encodeURIComponent(phrase);
        const url = `https://www.google.com/search?q=${query}`;
        chrome.tabs.create({ url: url });
      }
    });
  }
});
