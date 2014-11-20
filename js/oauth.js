var google = new OAuth2('google', {
	client_id: '722713518095-tpo9ibi81nts4fhpgf415m1e84h4rddq.apps.googleusercontent.com',
	client_secret: 'BfodvtWGmuvP64FkH1lQWcoA',
	api_scope: ['https://mail.google.com/',
				'https://www.googleapis.com/auth/gmail.compose',
				'https://www.googleapis.com/auth/gmail.modify',
				'https://www.googleapis.com/auth/gmail.readonly']
});

google.authorize(function() {
	// Hook up the form to create a new task with Google Tasks
	form.addEventListener('submit', function(event) {
		event.preventDefault();
		var PageToken = fetchList(null, "has:attachment");
		/*while(PageToken != ""){
			PageToken = fetchList(PageToken);
		}*/
	});
	document.querySelector("#upload").addEventListener("click", uploadFile, false);
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
							chrome.runtime.sendMessage({
								cmd: "send",
								msgId: messageObj.id,
								filename: part.filename,
								partId: part.partId,
								attachmentId: part.body.attachmentId
							}, function(response) {});

							getAttachment(messageObj.id, part.body.attachmentId);
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

function uploadFile() {
	var UPLOAD_URL = "https://www.googleapis.com/upload/gmail/v1/users/me/drafts";
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function(event) {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var ret = JSON.parse(xhr.responseText);
				console.log(ret);
			} else {
				console.log(xhr.status);
			}
		}
	};



	xhr.open('POST', UPLOAD_URL, true);
	xhr.setRequestHeader('Content-Type', 'message/rfc822');
	// xhr.setRequestHeader('Content-Length',attchList[0].size);
	var token = google.getAccessToken();
	xhr.setRequestHeader('Authorization', 'OAuth ' + token);
	data = '{\
	"message": {\
		"raw": "",\
		"payload": {\
			"mimeType": "multipart/mixed",\
			"filename": "",\
			"headers": [{\
				"name": "MIME-Version",\
				"value": "1.0"\
			}, {\
				"name": "Received",\
				"value": "by 10.140.42.48 with HTTP; Thu, 20 Nov 2014 04:51:41 -0800 (PST)"\
			}, {\
				"name": "To",\
				"value": "Leiguang Hao <pokerfacehlg@gmail.com>"\
			}, {\
				"name": "Date",\
				"value": "Thu, 20 Nov 2014 20:51:41 +0800"\
			}, {\
				"name": "Message-ID",\
				"value": "<CAJ+EFLMwW8Cch3-77Trbm6aQ07yJJG50_kLBpZhOy3yqmypn2A@mail.gmail.com>"\
			}, {\
				"name": "Subject",\
				"value": ""\
			}, {\
				"name": "From",\
				"value": "Leiguang Hao <pokerfacehlg@gmail.com>"\
			}, {\
				"name": "Content-Type",\
				"value": "multipart/mixed; boundary=047d7b5d2e863545b7050849cae0"\
			}],\
			"body": {\
				"size": 0\
			},\
			"parts": [{\
				"mimeType": "multipart/alternative",\
				"filename": "",\
				"headers": [{\
					"name": "Content-Type",\
					"value": "multipart/alternative; boundary=047d7b5d2e863545ac050849cade"\
				}],\
				"body": {\
					"size": 0\
				},\
				"parts": [{\
					"partId": "0.0",\
					"mimeType": "text/plain",\
					"filename": "",\
					"headers": [{\
						"name": "Content-Type",\
						"value": "text/plain; charset=UTF-8"\
					}, {\
						"name": "Content-Transfer-Encoding",\
						"value": "base64"\
					}],\
					"body": {\
						"size": 212,\
						"data": "DQoNCi0tIA0K6YOd6Zu35YWJDQrlk4jlsJTmu6jlt6XkuJrlpKflraborqHnrpfmnLrnp5HlrabkuI7mioDmnK_kuJPkuJrmnKznp5HlnKjor7sNCuWTiOWwlOa7qOW3peS4muWkp-WtpklCTVRD5oiQ5ZGYDQpMZWlndWFuZyBIYW8NCkp1bmlvciBTdHVkZW50IG9mIENvbXB1dGVyIFNjaWVuY2UgYW5kIFRlY2hub2xvZ3kgYXQgSElUDQpNZW1iZXIgb2YgSElUIElCTVRDDQo="\
					}\
				}, {\
					"partId": "0.1",\
					"mimeType": "text/html",\
					"filename": "",\
					"headers": [{\
						"name": "Content-Type",\
						"value": "text/html; charset=UTF-8"\
					}, {\
						"name": "Content-Transfer-Encoding",\
						"value": "base64"\
					}],\
					"body": {\
						"size": 596,\
						"data": "PGRpdiBkaXI9Imx0ciI-PGJyIGNsZWFyPSJhbGwiPjxkaXY-PGJyPjwvZGl2Pi0tIDxicj48ZGl2IGNsYXNzPSJnbWFpbF9zaWduYXR1cmUiPjxkaXYgZGlyPSJsdHIiPjxkaXY-PGRpdiBkaXI9Imx0ciI-PGRpdiBzdHlsZT0iY29sb3I6cmdiKDEzNiwxMzYsMTM2KSI-6YOd6Zu35YWJPC9kaXY-PGRpdiBzdHlsZT0iY29sb3I6cmdiKDEzNiwxMzYsMTM2KSI-5ZOI5bCU5ruo5bel5Lia5aSn5a2m6K6h566X5py656eR5a2m5LiO5oqA5pyv5LiT5Lia5pys56eR5Zyo6K-7PC9kaXY-PGRpdiBzdHlsZT0iY29sb3I6cmdiKDEzNiwxMzYsMTM2KSI-5ZOI5bCU5ruo5bel5Lia5aSn5a2mSUJNVEPmiJDlkZg8L2Rpdj48ZGl2IHN0eWxlPSJjb2xvcjpyZ2IoMTM2LDEzNiwxMzYpIj5MZWlndWFuZyBIYW88L2Rpdj48c3BhbiBzdHlsZT0iY29sb3I6cmdiKDEzNiwxMzYsMTM2KSI-SnVuaW9yIFN0dWRlbnQgb2YgQ29tcHV0ZXIgU2NpZW5jZSBhbmQgVGVjaG5vbG9neSBhdCBISVQ8L3NwYW4-PGRpdiBzdHlsZT0iY29sb3I6cmdiKDEzNiwxMzYsMTM2KSI-TWVtYmVyIG9mIEhJVCBJQk1UQzwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2Pg0KPC9kaXY-DQo="\
					}\
				}]\
			}, {\
				"partId": "1",\
				"mimeType": "text/html",\
				"filename": "",\
				"headers": [{\
					"name": "Content-Type",\
					"value": "text/html; charset=UTF-8"\
				}, {\
					"name": "Content-Disposition",\
					"value": "attachment"\
				}, {\
					"name": "Content-Transfer-Encoding",\
					"value": "base64"\
				}, {\
					"name": "X-Attachment-Id",\
					"value": "f25fd4bd5ac212f4_0.1"\
				}],\
				"body": {\
					"size": 596,\
					"data": "PGRpdiBkaXI9Imx0ciI-PGJyIGNsZWFyPSJhbGwiPjxkaXY-PGJyPjwvZGl2Pi0tIDxicj48ZGl2IGNsYXNzPSJnbWFpbF9zaWduYXR1cmUiPjxkaXYgZGlyPSJsdHIiPjxkaXY-PGRpdiBkaXI9Imx0ciI-PGRpdiBzdHlsZT0iY29sb3I6cmdiKDEzNiwxMzYsMTM2KSI-6YOd6Zu35YWJPC9kaXY-PGRpdiBzdHlsZT0iY29sb3I6cmdiKDEzNiwxMzYsMTM2KSI-5ZOI5bCU5ruo5bel5Lia5aSn5a2m6K6h566X5py656eR5a2m5LiO5oqA5pyv5LiT5Lia5pys56eR5Zyo6K-7PC9kaXY-PGRpdiBzdHlsZT0iY29sb3I6cmdiKDEzNiwxMzYsMTM2KSI-5ZOI5bCU5ruo5bel5Lia5aSn5a2mSUJNVEPmiJDlkZg8L2Rpdj48ZGl2IHN0eWxlPSJjb2xvcjpyZ2IoMTM2LDEzNiwxMzYpIj5MZWlndWFuZyBIYW88L2Rpdj48c3BhbiBzdHlsZT0iY29sb3I6cmdiKDEzNiwxMzYsMTM2KSI-SnVuaW9yIFN0dWRlbnQgb2YgQ29tcHV0ZXIgU2NpZW5jZSBhbmQgVGVjaG5vbG9neSBhdCBISVQ8L3NwYW4-PGRpdiBzdHlsZT0iY29sb3I6cmdiKDEzNiwxMzYsMTM2KSI-TWVtYmVyIG9mIEhJVCBJQk1UQzwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2Pg0KPC9kaXY-DQo="\
				}\
			}, {\
				"partId": "2",\
				"mimeType": "application/json",\
				"filename": "shadowsocks.json",\
				"headers": [{\
					"name": "Content-Type",\
					"value": "application/json; name=\"shadowsocks.json\""\
				}, {\
					"name": "Content-Disposition",\
					"value": "attachment; filename=\"shadowsocks.json\""\
				}, {\
					"name": "Content-Transfer-Encoding",\
					"value": "base64"\
				}, {\
					"name": "X-Attachment-Id",\
					"value": "f_i2q4bkz60"\
				}],\
				"body": {\
					"attachmentId": "ANGjdJ8JKYaAhZMm3vFP1ghwSHVC_vy335f03XvVjFT17IJIm_-4rne2uCWx7w6EADp7SF1sP9L2S3kHj5nm7m2BR6d3SiPvzRozJ8kUnDFyhxIrYYU_uwsh1bwQM-W-bxuw47Bkrx5zQeEuxWIH4JXeb69FYAKABSM6sUM3kakakNkyvwedzyDwdRlTJ28bDDah4SXIGhC8QGMrruL1ZZ-3nd1zRyqEZ2TdN_2omba3Sge8rTTTmyNWNqP9MpPbOJLdu1ZDu6r78Ti-z-QjIXOk2xVaNFkgwHa2g8Xr8g",\
					"size": 340\
				}\
			}]\
		}\
	}\
}'

	xhr.send(data);
}