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

var msgs = new Array(); //附件信息,json数组
var count = 0; //附件个数

/**
 * popup 与 content_scripts 通过background通信
 * @param  {[json]} message      [{cmd,msgId,attachId}]
 * @param  {[type]} sender       [description]
 * @param  {[type]} sendResponse [接受或传递消息成功后的回调函数]
 */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // console.log(message);
  if (message.cmd == "send") {
    msgs[count] = {
      msgId: message.msgId,
      attachId: message.attachId
    };
    count ++;
    /*console.log(message.msgId);
    console.log(message.attachId);*/
    chrome.storage.local.set(msgs[count-1],function(items){
      console.log(items);
    });
  } else if (message.cmd == "get") {
    sendResponse(msgs);
  }

});

