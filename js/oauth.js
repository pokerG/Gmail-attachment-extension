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
	data = 'Content-Type: multipart/mixed; boundary=001a11c1bd5e24861305085946c5\n\
--001a11c1bd5e24861305085946c5\n\
Content-Type: application/octet-stream; name=t2\n\
Content-Disposition: attachment; filename=t2\n\
Content-Transfer-Encoding: base64\n\
\n\
PCBkaXYgY2xhc3MgPSAiZEwiCnRhYmluZGV4ID0gIi0xIgppZCA9ICI6bXgiCmFyaWEgLSBsYWJl\n\
bCA9ICLpmYTku7bvvJpMZWN0dXJlMi5wcHR444CC5oyJIEVudGVyIOmUruWPr+afpeeci+mZhOS7\n\
tu+8jOaMiSBEZWxldGUg6ZSu5Y+v5bCG5YW256e76ZmkIiA+IDwgaW5wdXQgaWQgPSAiOm41Igpu\n\
YW1lID0gImF0dGFjaCIKdHlwZSA9ICJoaWRkZW4iCnZhbHVlID0gIjE0OWNjODBlZGViYzY3YzJf\n\
MTQ5Y2M4MGVkZWJjNjdjMl8wLjFfLTEiCmNoZWNrZWQgPSAiIiA+IDwgYSBjbGFzcyA9ICJkTyIK\n\
aWQgPSAiOm40IgpocmVmID0gIj91aT0yJmFtcDtpaz1iYmI1NjM5Y2YxJmFtcDt2aWV3PWF0dCZh\n\
bXA7dGg9MTQ5Y2M4MGVkZWJjNjdjMiZhbXA7YXR0aWQ9MC4xJmFtcDtkaXNwPXNhZmUmYW1wO3Jl\n\
YWxhdHRpZD1mX2kycHdxMGtlMCZhbXA7enciCnRhcmdldCA9ICJfYmxhbmsiID4gPCBkaXYgY2xh\n\
c3MgPSAidkkiID4gTGVjdHVyZTIucHB0eCA8IC9kaXY+IDxkaXYgY2xhc3M9InZKIj4oNSw0ODIg\n\
Syk8L2RpdiA+IDwgL2E+IDxkaXYgaWQ9IjpuNyIgcm9sZT0iYnV0dG9uIiBjbGFzcz0idnEiIHRh\n\
YmluZGV4PSItMSI+PC9kaXYgPiA8IC9kaXY+Cgo8IGRpdiBjbGFzcyA9ICJkTCIKdGFiaW5kZXgg\n\
PSAiLTEiCmlkID0gIjpuayIKYXJpYSAtIGxhYmVsID0gIumZhOS7tu+8mnRhZ3PjgILmjIkgRW50\n\
ZXIg6ZSu5Y+v5p+l55yL6ZmE5Lu277yM5oyJIERlbGV0ZSDplK7lj6/lsIblhbbnp7vpmaQiID4g\n\
PCBpbnB1dCBpZCA9ICI6bmMiCm5hbWUgPSAiYXR0YWNoIgp0eXBlID0gImhpZGRlbiIKdmFsdWUg\n\
PSAiMTQ5Y2M4MGVkZWJjNjdjMl8xNDljYzgwZWRlYmM2N2MyXzAuMl8tMSIKY2hlY2tlZCA9ICIi\n\
ID4gPCBhIGNsYXNzID0gImRPIgppZCA9ICI6bmQiCmhyZWYgPSAiP3VpPTImYW1wO2lrPWJiYjU2\n\
MzljZjEmYW1wO3ZpZXc9YXR0JmFtcDt0aD0xNDljYzgwZWRlYmM2N2MyJmFtcDthdHRpZD0wLjIm\n\
YW1wO2Rpc3A9c2FmZSZhbXA7cmVhbGF0dGlkPWZfaTJwd3M1NHUxJmFtcDt6dyIKdGFyZ2V0ID0g\n\
Il9ibGFuayIgPiA8IGRpdiBjbGFzcyA9ICJ2SSIgPiB0YWdzIDwgL2Rpdj4gPGRpdiBjbGFzcz0i\n\
dkoiPigxMDkgSyk8L2RpdiA+IDwgL2E+IDxkaXYgaWQ9IjpuYSIgcm9sZT0iYnV0dG9uIiBjbGFz\n\
cz0idnEiIHRhYmluZGV4PSItMSI+PC9kaXYgPiA8IC9kaXY+Cgo8IGRpdiBjbGFzcyA9ICJkTCIK\n\
dGFiaW5kZXggPSAiLTEiCmlkID0gIjpueSIKYXJpYSAtIGxhYmVsID0gIumZhOS7tu+8mk1ha2Vm\n\
aWxl44CC5oyJIEVudGVyIOmUruWPr+afpeeci+mZhOS7tu+8jOaMiSBEZWxldGUg6ZSu5Y+v5bCG\n\
5YW256e76ZmkIiA+IDwgaW5wdXQgaWQgPSAiOm5xIgpuYW1lID0gImF0dGFjaCIKdHlwZSA9ICJo\n\
aWRkZW4iCnZhbHVlID0gIjE0OWNjODBlZGViYzY3YzJfMTQ5Y2M4MGVkZWJjNjdjMl8wLjNfLTEi\n\
CmNoZWNrZWQgPSAiIiA+IDwgYSBjbGFzcyA9ICJkTyIKaWQgPSAiOm5yIgpocmVmID0gIj91aT0y\n\
JmFtcDtpaz1iYmI1NjM5Y2YxJmFtcDt2aWV3PWF0dCZhbXA7dGg9MTQ5Y2M4MGVkZWJjNjdjMiZh\n\
bXA7YXR0aWQ9MC4zJmFtcDtkaXNwPXNhZmUmYW1wO3JlYWxhdHRpZD1mX2kycHdzN2o5MiZhbXA7\n\
enciCnRhcmdldCA9ICJfYmxhbmsiID4gPCBkaXYgY2xhc3MgPSAidkkiID4gTWFrZWZpbGUgPCAv\n\
ZGl2PiA8ZGl2IGNsYXNzPSJ2SiI+KDQgSyk8L2RpdiA+IDwgL2E+IDxkaXYgaWQ9IjpubyIgcm9s\n\
ZT0iYnV0dG9uIiBjbGFzcz0idnEiIHRhYmluZGV4PSItMSI+PC9kaXYgPiA8IC9kaXY+Cgo/IHVp\n\
ID0gMiAmIGFtcDsKaWsgPSBiYmI1NjM5Y2YxICYgYW1wOwp2aWV3ID0gYXR0ICYgYW1wOwp0aCA9\n\
IDE0OTkzIGI1MTUzNDk3OWNkICYgYW1wOwphdHRpZCA9IDAuMSAmIGFtcDsKZGlzcCA9IHNhZmUg\n\
JiBhbXA7CnJlYWxhdHRpZCA9IGZfaTJhNWdqZWM0ICYgYW1wOwp6dwoKCTwgZGl2IGNsYXNzID0g\n\
ImRMIgp0YWJpbmRleCA9ICItMSIKaWQgPSAiOm55IgphcmlhIC0gbGFiZWwgPSAi6ZmE5Lu277ya\n\
cmVwb3J0LnR4dOOAguaMiSBFbnRlciDplK7lj6/mn6XnnIvpmYTku7bvvIzmjIkgRGVsZXRlIOmU\n\
ruWPr+WwhuWFtuenu+mZpCIgPiA8IGlucHV0IGlkID0gIjpucSIKbmFtZSA9ICJhdHRhY2giCnR5\n\
cGUgPSAiaGlkZGVuIgp2YWx1ZSA9ICIxNDljYzg3YjRiYTNlZDFkXzE0OWNjODdiNGJhM2VkMWRf\n\
MC4xXy0xIgpjaGVja2VkID0gIiIgPiA8IGEgY2xhc3MgPSAiZE8iCmlkID0gIjpuciIKaHJlZiA9\n\
ICI/dWk9MiZhbXA7aWs9YmJiNTYzOWNmMSZhbXA7dmlldz1hdHQmYW1wO3RoPTE0OTkzYjUxNTM0\n\
OTc5Y2QmYW1wO2F0dGlkPTAuMSZhbXA7ZGlzcD1zYWZlJmFtcDtyZWFsYXR0aWQ9Zl9pMmE1Z2pl\n\
YzQmYW1wO3p3Igp0YXJnZXQgPSAiX2JsYW5rIiA+IDwgZGl2IGNsYXNzID0gInZJIiA+IHJlcG9y\n\
dC50eHQgPCAvZGl2PiA8ZGl2IGNsYXNzPSJ2SiI+KDEgSyk8L2RpdiA+IDwgL2E+IDxkaXYgaWQ9\n\
IjpubyIgcm9sZT0iYnV0dG9uIiBjbGFzcz0idnEiIHRhYmluZGV4PSItMSI+PC9kaXYgPiA8IC9k\n\
aXY+CgpwZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgiZGl2Iik7CnBkaXYuc2V0QXR0cmli\n\
dXRlKCJjbGFzcyIsICJkTCIpOwpwZGl2LnNldEF0dHJpYnV0ZSgidGFiaW5kZXgiLCAiLTEiKTsK\n\
cGRpdi5zZXRBdHRyaWJ1dGUoImlkIiwgIjpueSIpOwpwZGl2LnNldEF0dHJpYnV0ZSgiYXJpYS1s\n\
YWJlbCIsICLpmYTku7bvvJpyZXBvcnQudHh044CC5oyJIEVudGVyIOmUruWPr+afpeeci+mZhOS7\n\
tu+8jOaMiSBEZWxldGUg6ZSu5Y+v5bCG5YW256e76ZmkIik7CgpjaW5wdXQgPSBkb2N1bWVudC5j\n\
cmVhdGVFbGVtZW50KCJpbnB1dCIpOwpjaW5wdXQuc2V0QXR0cmlidXRlKCJpZCIsIjpucSIpOwpj\n\
aW5wdXQuc2V0QXR0cmlidXRlKCJuYW1lIiwiYXR0YWNoIik7CmNpbnB1dC5zZXRBdHRyaWJ1dGUo\n\
InR5cGUiLCJoaWRkZW4iKTsKY2lucHV0LnNldEF0dHJpYnV0ZSgidmFsdWUiLCIxNDljY2MwMTM2\n\
MDhjNGQ1XzE0OWNjYzAxMzYwOGM0ZDVfMC4xXy0xIik7CmNpbnB1dC5zZXRBdHRyaWJ1dGUoImNo\n\
ZWNrZWQiLCIiKTsKcGRpdi5hcHBlbmRDaGlsZChjaW5wdXQpOwoKY2EgPSBkb2N1bWVudC5jcmVh\n\
dGVFbGVtZW50KCJhIik7CmNhLnNldEF0dHJpYnV0ZSgiY2xhc3MiLCJkTyIpOwpjYS5zZXRBdHRy\n\
aWJ1dGUoImlkIiwiOm5yIik7CmNhLnNldEF0dHJpYnV0ZSgiaHJlZiIsIj91aT0yJmlrPWJiYjU2\n\
MzljZjEmdmlldz1hdHQmdGg9MTQ5OTNiNTE1MzQ5NzljZCZhdHRpZD0wLjEmZGlzcD1zYWZlJnJl\n\
YWxhdHRpZD1mX2kyYTVnamVjNCZ6dyIpOwpjYS5zZXRBdHRyaWJ1dGUoInRhcmdldCIsIl9ibGFu\n\
ayIpOwpwZGl2LmFwcGVuZENoaWxkKGNhKTsKY2RpdjEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50\n\
KCJkaXYiKTsKY2RpdjEuc2V0QXR0cmlidXRlKCJjbGFzcyIsInZJIik7CmNkaXYxLmlubmVyVGV4\n\
dCA9ICJyZXBvcnQudHh0IjsKY2EuYXBwZW5kQ2hpbGQoY2RpdjEpOwpjZGl2MiA9IGRvY3VtZW50\n\
LmNyZWF0ZUVsZW1lbnQoImRpdiIpOwpjZGl2Mi5zZXRBdHRyaWJ1dGUoImNsYXNzIiwidkoiKTsK\n\
Y2RpdjIuaW5uZXJUZXh0ID0gIigxIEspIjsKY2EuYXBwZW5kQ2hpbGQoY2RpdjIpOwpjZGl2MyA9\n\
IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoImRpdiIpOwpjZGl2My5zZXRBdHRyaWJ1dGUoImlkIiwi\n\
Om5vIik7CmNkaXYzLnNldEF0dHJpYnV0ZSgicm9sZSIsImJ1dHRvbiIpOwpjZGl2My5zZXRBdHRy\n\
aWJ1dGUoImNsYXNzIiwidnEiKTsKY2RpdjMuc2V0QXR0cmlidXRlKCJ0YWJpbmRleCIsIi0xIik7\n\
CnBkaXYuYXBwZW5kQ2hpbGQoY2RpdjMpOwoKaHR0cHM6Ly9tYWlsLmdvb2dsZS5jb20vbWFpbC91\n\
LzAvP3VpPTImaWs9YmJiNTYzOWNmMSZ2aWV3PWF0dCZ0aD0xNDk5M2I1MTUzNDk3OWNkJmF0dGlk\n\
PTAuMSZkaXNwPXNhZmUmcmVhbGF0dGlkPWZfaTJhNWdqZWM0Jnp3Cj91aT0yJmFtcDtpaz1iYmI1\n\
NjM5Y2YxJmFtcDt2aWV3PWF0dCZhbXA7dGg9MTQ5OTNiNTE1MzQ5NzljZCZhbXA7YXR0aWQ9MC4x\n\
JmFtcDtkaXNwPXNhZmUmYW1wO3JlYWxhdHRpZD1mX2kyYTVnamVjNCZhbXA7encKCj91aT0yJmlr\n\
PWJiYjU2MzljZjEmdmlldz1hdHQmYW1wO3RoPTE0OTkzYjUxNTM0OTc5Y2QmYW1wO2F0dGlkPTAu\n\
MSZhbXA7ZGlzcD1zYWZlJmFtcDtyZWFsYXR0aWQ9Zl9pMmE1Z2plYzQmYW1wO3p3Cgo/dWk9MiZp\n\
az1iYmI1NjM5Y2YxJnZpZXc9YXR0JnRoPTE0OWNjYTY2MzMxMjU5MjEmYXR0aWQ9MC4xJmRpc3A9\n\
c2FmZSZyZWFsYXR0aWQ9Zl9pMnB5OHVyMzAmencKaHR0cHM6Ly9tYWlsLmdvb2dsZS5jb20vbWFp\n\
bC91LzAvP3VpPTImaWs9YmJiNTYzOWNmMSZ2aWV3PWF0dCZ0aD0xNDljY2IzZTA1M2Y3N2I5JmF0\n\
dGlkPTAuMSZkaXNwPXNhZmUmcmVhbGF0dGlkPWNmZDlhYzQ1YzhkNjc0YV8wLjEmenc=\n\
--001a11c1bd5e24861305085946c5\n\
Content-Type: application/json; name="shadowsocks.json"\n\
Content-Disposition: attachment; filename="shadowsocks.json"\n\
Content-Transfer-Encoding: base64\n\
\n\
ew0gICAgInNlcnZlciI6IjE5Mi44MS4xMzMuMTE2IiwNICAgICJzZXJ2ZXJfcG9ydCI6NTEzMzMs\n\
DSAgICAibG9jYWxfYWRkcmVzcyI6ICIxMjcuMC4wLjEiLA0gICAgImxvY2FsX3BvcnQiOjEwODAs\n\
DSAgICAicGFzc3dvcmQiOiJGb09UT28jSUJNVEMjMjAxNDUyMjUxNiIsDSAgICAidGltZW91dCI6\n\
MzAwLA0gICAgIm1ldGhvZCI6ImFlcy0yNTYtY2ZiIiwNICAgICJmYXN0X29wZW4iOiBmYWxzZSwN\n\
ICAgICJ3b3JrZXJzIjogMQ19DQo=\n\
--001a11c1bd5e24861305085946c5--'
	
	xhr.send(data);
}

