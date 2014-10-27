// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([{
      // That fires when the URL matchs gmail...
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            urlContains: 'mail.google.com'
          },
        })
      ],
      // And shows the extension's page action.
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // console.log(message);
  if (message.cmd == "send") {
    msg = {
      msgId: message.msgId,
      attachId: message.attachId
    };
    console.log(message.msgId);
    console.log(message.attachId);
  } else if (message.cmd == "get") {
    sendResponse(msg);
  }

});