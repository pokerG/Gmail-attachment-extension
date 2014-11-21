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
	var UPLOAD_URL = "https://www.googleapis.com/upload/gmail/v1/users/me/drafts?uploadType=media";
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
	// xhr.setRequestHeader('Content-Length',1611);
	var token = google.getAccessToken();
	xhr.setRequestHeader('Authorization', 'OAuth ' + token);
	// data = '{"message":{"raw":"PGRpdiBjbGFzcz0iZEwiIHRhYmluZGV4PSItMSIgaWQ9IjpteCIgYXJpYS1sYWJlbD0i6ZmE5Lu277yaTGVjdHVyZTIucHB0eOOAguaMiSBFbnRlciDplK7lj6_mn6XnnIvpmYTku7bvvIzmjIkgRGVsZXRlIOmUruWPr-WwhuWFtuenu-mZpCI-PGlucHV0IGlkPSI6bjUiIG5hbWU9ImF0dGFjaCIgdHlwZT0iaGlkZGVuIiB2YWx1ZT0iMTQ5Y2M4MGVkZWJjNjdjMl8xNDljYzgwZWRlYmM2N2MyXzAuMV8tMSIgY2hlY2tlZD0iIj48YSBjbGFzcz0iZE8iIGlkPSI6bjQiIGhyZWY9Ij91aT0yJmFtcDtpaz1iYmI1NjM5Y2YxJmFtcDt2aWV3PWF0dCZhbXA7dGg9MTQ5Y2M4MGVkZWJjNjdjMiZhbXA7YXR0aWQ9MC4xJmFtcDtkaXNwPXNhZmUmYW1wO3JlYWxhdHRpZD1mX2kycHdxMGtlMCZhbXA7enciIHRhcmdldD0iX2JsYW5rIj48ZGl2IGNsYXNzPSJ2SSI-TGVjdHVyZTIucHB0eDwvZGl2PiA8ZGl2IGNsYXNzPSJ2SiI-KDUsNDgyIEspPC9kaXY-PC9hPiA8ZGl2IGlkPSI6bjciIHJvbGU9ImJ1dHRvbiIgY2xhc3M9InZxIiB0YWJpbmRleD0iLTEiPjwvZGl2PjwvZGl2PgoKPGRpdiBjbGFzcz0iZEwiIHRhYmluZGV4PSItMSIgaWQ9IjpuayIgYXJpYS1sYWJlbD0i6ZmE5Lu277yadGFnc-OAguaMiSBFbnRlciDplK7lj6_mn6XnnIvpmYTku7bvvIzmjIkgRGVsZXRlIOmUruWPr-WwhuWFtuenu-mZpCI-PGlucHV0IGlkPSI6bmMiIG5hbWU9ImF0dGFjaCIgdHlwZT0iaGlkZGVuIiB2YWx1ZT0iMTQ5Y2M4MGVkZWJjNjdjMl8xNDljYzgwZWRlYmM2N2MyXzAuMl8tMSIgY2hlY2tlZD0iIj48YSBjbGFzcz0iZE8iIGlkPSI6bmQiIGhyZWY9Ij91aT0yJmFtcDtpaz1iYmI1NjM5Y2YxJmFtcDt2aWV3PWF0dCZhbXA7dGg9MTQ5Y2M4MGVkZWJjNjdjMiZhbXA7YXR0aWQ9MC4yJmFtcDtkaXNwPXNhZmUmYW1wO3JlYWxhdHRpZD1mX2kycHdzNTR1MSZhbXA7enciIHRhcmdldD0iX2JsYW5rIj48ZGl2IGNsYXNzPSJ2SSI-dGFnczwvZGl2PiA8ZGl2IGNsYXNzPSJ2SiI-KDEwOSBLKTwvZGl2PjwvYT4gPGRpdiBpZD0iOm5hIiByb2xlPSJidXR0b24iIGNsYXNzPSJ2cSIgdGFiaW5kZXg9Ii0xIj48L2Rpdj48L2Rpdj4KCjxkaXYgY2xhc3M9ImRMIiB0YWJpbmRleD0iLTEiIGlkPSI6bnkiIGFyaWEtbGFiZWw9IumZhOS7tu-8mk1ha2VmaWxl44CC5oyJIEVudGVyIOmUruWPr-afpeeci-mZhOS7tu-8jOaMiSBEZWxldGUg6ZSu5Y-v5bCG5YW256e76ZmkIj48aW5wdXQgaWQ9IjpucSIgbmFtZT0iYXR0YWNoIiB0eXBlPSJoaWRkZW4iIHZhbHVlPSIxNDljYzgwZWRlYmM2N2MyXzE0OWNjODBlZGViYzY3YzJfMC4zXy0xIiBjaGVja2VkPSIiPjxhIGNsYXNzPSJkTyIgaWQ9IjpuciIgaHJlZj0iP3VpPTImYW1wO2lrPWJiYjU2MzljZjEmYW1wO3ZpZXc9YXR0JmFtcDt0aD0xNDljYzgwZWRlYmM2N2MyJmFtcDthdHRpZD0wLjMmYW1wO2Rpc3A9c2FmZSZhbXA7cmVhbGF0dGlkPWZfaTJwd3M3ajkyJmFtcDt6dyIgdGFyZ2V0PSJfYmxhbmsiPjxkaXYgY2xhc3M9InZJIj5NYWtlZmlsZTwvZGl2PiA8ZGl2IGNsYXNzPSJ2SiI-KDQgSyk8L2Rpdj48L2E-IDxkaXYgaWQ9IjpubyIgcm9sZT0iYnV0dG9uIiBjbGFzcz0idnEiIHRhYmluZGV4PSItMSI-PC9kaXY-PC9kaXY-"}}}}';
	data = 'Content-Type: application/json; name="shadowsocks.json"\nContent-Disposition: attachment; filename="shadowsocks.json"\nContent-Transfer-Encoding: base64\n\new0gICAgInNlcnZlciI6IjE5Mi44MS4xMzMuMTE2IiwNICAgICJzZXJ2ZXJfcG9ydCI6NTEzMzMsDSAgICAibG9jYWxfYWRkcmVzcyI6ICIxMjcuMC4wLjEiLA0gICAgImxvY2FsX3BvcnQiOjEwODAsDSAgICAicGFzc3dvcmQiOiJGb09UT28jSUJNVEMjMjAxNDUyMjUxNiIsDSAgICAidGltZW91dCI6MzAwLA0gICAgIm1ldGhvZCI6ImFlcy0yNTYtY2ZiIiwNICAgICJmYXN0X29wZW4iOiBmYWxzZSwNICAgICJ3b3JrZXJzIjogMQ19DQo='
	
	xhr.send(data);
}

