let isDragging = false;
let mouseOffsetX = 0;
let mouseOffsetY = 0;

browser.browserAction.onClicked.addListener(async (info, tab) => {
  // create the popup window
  chrome.windows.create({
    type: "popup",
    url: chrome.runtime.getURL("index.html"),
    width: 350,
    height: 470,
    top: 0,
    left: 0
  }, (window) => { });
});
