var google = new OAuth2('google', {
  client_id: '722713518095-tpo9ibi81nts4fhpgf415m1e84h4rddq.apps.googleusercontent.com',
  client_secret: 'BfodvtWGmuvP64FkH1lQWcoA',
  api_scope: 'https://www.googleapis.com/auth/gmail.readonly'
});
google.authorize(function() {
  // Hook up the form to create a new task with Google Tasks
  // form.addEventListener('submit', function(event) {
  //   event.preventDefault();
  //   var PageToken = fetchList(null, "has:attachment");
  /*while(PageToken != ""){
    PageToken = fetchList(PageToken);
  }*/

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
if (message.cmd == "get") {
    sendResponse(msgs);
  } else if (message.cmd == "download") {
    chrome.downloads.download({
      url: message.url,
      conflictAction: 'uniquify',
      saveAs: true
    })
  } else if (message.cmd == "draft"){
    var df = getDraftsList();
    sendResponse(df);
  }

});

var msgList = new Array();
var attchList = new Array();

/**
 * 获取邮件列表,根据特定条件
 * @param  {[string]} nextPageToken 下一页邮件列表的token
 * ToDo 查询条件
 */

function fetchList(PageToken, q) {
  var LIST_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages';
  LIST_FETCH_URL = LIST_FETCH_URL + "?q=" + q;
  // LIST_FETCH_URL = encodeURI(LIST_FETCH_URL);
  var xhr = new XMLHttpRequest();
  var nextPageToken = "";
  //var msg = gapi.client.gmail.users.messages.get({"id":list.messages[i].id});
  xhr.onreadystatechange = function(event) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var list = JSON.parse(xhr.responseText);
        //Fetch information of the attachments with a for loop
        for (var i = 0; i < list.messages.length; i++) {
          getMessage(list.messages[i].id);
        }

        //递归获取
        /*if (typeof(list.nextPageToken) != "undefined") {
          nextPageToken = list.nextPageToken;
        } else {
          nextPageToken = "";
        }*/
      } else {
        console.log(xhr.status);
      }
    }
  };
  if (PageToken != null) {
    // xhr.open('GET', LIST_FETCH_URL + "&pageToken=" + PageToken);
  } else {
    xhr.open('GET', LIST_FETCH_URL, true);
  }

  xhr.setRequestHeader('Content-Type', 'application/json');
  var token = google.getAccessToken();
  xhr.setRequestHeader('Authorization', 'OAuth ' + token);
  xhr.send(null);
  return nextPageToken;
}



/**
 * 获取邮件信息
 * @param  {[string]} MessageId [邮件id]
 */
function getMessage(MessageId) {
  var MESSAGE_FETCH_URL_PREFIX = 'https://www.googleapis.com/gmail/v1/users/me/messages/'; //messageId
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(event) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {

        var messageObj = JSON.parse(xhr.responseText);
        var parts = messageObj.payload.parts;

        msgList[msgList.length] = messageObj;

        //Fetch information of the attachments with a for loop
        if (typeof(parts) != "undefined") {
          for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            if (part.body.attachmentId != null && part.filename != "") {
              msgs[msgs.length] = {
                msgId: messageObj.id,
                filename: part.filename,
                partId: part.partId,
                attachmentId: part.body.attachmentId,
                size:part.body.size
              }
              chrome.storage.local.set(msgs[msgs.length - 1], function(items) {
                console.log(items);
              });
              // getAttachment(messageObj.id, part.body.attachmentId);
              console.log(messageObj);
            }
          }
        }
      } else {
        console.log(xhr.status);
      }
    }
  };

  xhr.open('GET', MESSAGE_FETCH_URL_PREFIX + MessageId, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var token = google.getAccessToken();
  xhr.setRequestHeader('Authorization', 'OAuth ' + token);
  xhr.send(null);
}


/**
 * 获取附件MIME
 * @param  {[string]} messageId [邮件id]
 * @param  {[string]} attchId   [附件id]
 */
function getAttachment(messageId, attchId) {
  var ATTACHMENT_FETCH_URL_PREFIX = 'https://www.googleapis.com/gmail/v1/users/me/messages/';
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(event) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var attchObj = JSON.parse(xhr.responseText);
        if (typeof(attchObj) != "undefined") {
          attchList[attchList.length] = attchObj;
        }
      } else {
        console.log(xhr.status);
      }
    }
  };


  xhr.open('GET', ATTACHMENT_FETCH_URL_PREFIX + messageId + '/attachments/' + attchId, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var token = google.getAccessToken();
  xhr.setRequestHeader('Authorization', 'OAuth ' + token);
  xhr.send(null);
}

function getDraftsList(){
  var DRAFT_LIST_URL = "https://www.googleapis.com/gmail/v1/users/me/drafts";
  var xhr = new XMLHttpRequest();
  xhr.open('GET', DRAFT_LIST_URL, false);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var token = google.getAccessToken();
  xhr.setRequestHeader('Authorization', 'OAuth ' + token);
  xhr.send(null);
  var res = JSON.parse(xhr.responseText);
  drafts = res.drafts;
  console.log(drafts[0]);
  return drafts[0];
}


fetchList(null, "has:attachment");