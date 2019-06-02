// on clicked on the extension icon - open new page
chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      }, function (tabs) {
        var tab = tabs[0]
        var url = tab.url;
        chrome.tabs.create({ url: chrome.extension.getURL('html/main.html' +  "?tabUrl=" + url ), selected: true });
      })
  });