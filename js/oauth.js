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
	data = '{"message":{"raw":"","payload":{"mimeType":"multipart/alternative","filename":"","headers":[{"name":"Delivered-To","value":"pokerfacehlg@gmail.com"},{"name":"Received","value":"by 10.140.42.48 with SMTP id b45csp79625qga;        Thu, 20 Nov 2014 05:49:06 -0800 (PST)"},{"name":"X-Received","value":"by 10.170.44.214 with SMTP id 205mr24301511ykm.78.1416491345921;        Thu, 20 Nov 2014 05:49:05 -0800 (PST)"},{"name":"Return-Path","value":"<noreply@github.com>"},{"name":"Received","value":"from github-smtp2a-ext-cp1-prd.iad.github.net (github-smtp2-ext4.iad.github.net. [192.30.252.195])        by mx.google.com with ESMTPS id u10si898193yhf.138.2014.11.20.05.49.05        for <pokerfacehlg@gmail.com>        (version=TLSv1.2 cipher=ECDHE-RSA-AES128-GCM-SHA256 bits=128/128);        Thu, 20 Nov 2014 05:49:05 -0800 (PST)"},{"name":"Received-SPF","value":"pass (google.com: domain of noreply@github.com designates 192.30.252.195 as permitted sender) client-ip=192.30.252.195;"},{"name":"Authentication-Results","value":"mx.google.com;       spf=pass (google.com: domain of noreply@github.com designates 192.30.252.195 as permitted sender) smtp.mail=noreply@github.com;       dkim=pass (test mode) header.i=@github.com;       dmarc=pass (p=NONE dis=NONE) header.from=github.com"},{"name":"Date","value":"Thu, 20 Nov 2014 05:49:05 -0800"},{"name":"DKIM-Signature","value":"v=1; a=rsa-sha256; c=relaxed/relaxed; d=github.com; s=pf2014; t=1416491345; bh=/cAL1IeGfVazTZORnbBczSV/8cNa5O1OjZdxDedEOSw=; h=From:Reply-To:To:In-Reply-To:References:Subject:List-ID:\t List-Archive:List-Post:List-Unsubscribe:From; b=dygh6eL16Q6RwIKh2AsdzmI3ZsaoOIw3mNM3Ux0h6Rernnj2l+xnCumb0ypuF4Jma\t YqVoyG/lEMo43pOMXsX5oLY5NfhTDs0vJDKDFvPstWymi6okfXz0Wj32e+zy4gKCG9\t Qk8AMDC/ai4Zd+ukvhZJ32i8d5pkTOpPhNjVakf0="},{"name":"From","value":"kalopsia <notifications@github.com>"},{"name":"Reply-To","value":"\"astaxie/build-web-application-with-golang\" <reply+004ba97ae9869cebe60fd92740f681f6d2befd0de5cb02c192cf000000011085b35192a169ce02eb97e2@reply.github.com>"},{"name":"To","value":"\"astaxie/build-web-application-with-golang\" <build-web-application-with-golang@noreply.github.com>"},{"name":"Message-ID","value":"<astaxie/build-web-application-with-golang/issue/392/issue_event/196147377@github.com>"},{"name":"In-Reply-To","value":"<astaxie/build-web-application-with-golang/issues/392@github.com>"},{"name":"References","value":"<astaxie/build-web-application-with-golang/issues/392@github.com>"},{"name":"Subject","value":"Re: [build-web-application-with-golang] Does this book give knowledges to create your own web application without Beego?  (#392)"},{"name":"Mime-Version","value":"1.0"},{"name":"Content-Type","value":"multipart/alternative; boundary=\"--==_mimepart_546df15199b98_34003ff19781d29c897477\"; charset=UTF-8"},{"name":"Content-Transfer-Encoding","value":"7bit"},{"name":"Precedence","value":"list"},{"name":"X-GitHub-Sender","value":"kalopsia"},{"name":"X-GitHub-Recipient","value":"pokerG"},{"name":"List-ID","value":"astaxie/build-web-application-with-golang <build-web-application-with-golang.astaxie.github.com>"},{"name":"List-Archive","value":"https://github.com/astaxie/build-web-application-with-golang"},{"name":"List-Post","value":"<mailto:reply+004ba97ae9869cebe60fd92740f681f6d2befd0de5cb02c192cf000000011085b35192a169ce02eb97e2@reply.github.com>"},{"name":"List-Unsubscribe","value":"<mailto:unsub+004ba97ae9869cebe60fd92740f681f6d2befd0de5cb02c192cf000000011085b35192a169ce02eb97e2@reply.github.com>, <https://github.com/notifications/unsubscribe/AEupelbxQavJVXKYfqCSIZN0R-2ZCO5fks5nPejRgaJpZM4C8HCn>"},{"name":"X-Auto-Response-Suppress","value":"All"},{"name":"X-GitHub-Recipient-Address","value":"pokerfacehlg@gmail.com"}],"body":{"size":0},"parts":[{"partId":"0","mimeType":"text/plain","filename":"","headers":[{"name":"Content-Type","value":"text/plain; charset=UTF-8"},{"name":"Content-Transfer-Encoding","value":"7bit"}],"body":{"size":160,"data":"Q2xvc2VkICMzOTIuDQoNCi0tLQ0KUmVwbHkgdG8gdGhpcyBlbWFpbCBkaXJlY3RseSBvciB2aWV3IGl0IG9uIEdpdEh1YjoNCmh0dHBzOi8vZ2l0aHViLmNvbS9hc3RheGllL2J1aWxkLXdlYi1hcHBsaWNhdGlvbi13aXRoLWdvbGFuZy9pc3N1ZXMvMzkyI2V2ZW50LTE5NjE0NzM3Nw=="}},{"partId":"1","mimeType":"text/html","filename":"","headers":[{"name":"Content-Type","value":"text/html; charset=UTF-8"},{"name":"Content-Transfer-Encoding","value":"7bit"}],"body":{"size":1009,"data":"PHA-Q2xvc2VkIDxhIGhyZWY9Imh0dHBzOi8vZ2l0aHViLmNvbS9hc3RheGllL2J1aWxkLXdlYi1hcHBsaWNhdGlvbi13aXRoLWdvbGFuZy9pc3N1ZXMvMzkyIiBjbGFzcz0iaXNzdWUtbGluayIgdGl0bGU9IkRvZXMgdGhpcyBib29rIGdpdmUga25vd2xlZGdlcyB0byBjcmVhdGUgeW91ciBvd24gd2ViIGFwcGxpY2F0aW9uIHdpdGhvdXQgQmVlZ28_ICI-IzM5MjwvYT4uPC9wPg0KDQo8cCBzdHlsZT0iZm9udC1zaXplOnNtYWxsOy13ZWJraXQtdGV4dC1zaXplLWFkanVzdDpub25lO2NvbG9yOiM2NjY7Ij4mbWRhc2g7PGJyPlJlcGx5IHRvIHRoaXMgZW1haWwgZGlyZWN0bHkgb3IgPGEgaHJlZj0iaHR0cHM6Ly9naXRodWIuY29tL2FzdGF4aWUvYnVpbGQtd2ViLWFwcGxpY2F0aW9uLXdpdGgtZ29sYW5nL2lzc3Vlcy8zOTIjZXZlbnQtMTk2MTQ3Mzc3Ij52aWV3IGl0IG9uIEdpdEh1YjwvYT4uPGltZyBhbHQ9IiIgaGVpZ2h0PSIxIiBzcmM9Imh0dHBzOi8vZ2l0aHViLmNvbS9ub3RpZmljYXRpb25zL2JlYWNvbi9BRXVwZXN2YTNYd3RrQTFnMTY1azJsUVRlcHZNX0hKUmtzNW5QZWpSZ2FKcFpNNEM4SENuLmdpZiIgd2lkdGg9IjEiIC8-PC9wPg0KPGRpdiBpdGVtc2NvcGUgaXRlbXR5cGU9Imh0dHA6Ly9zY2hlbWEub3JnL0VtYWlsTWVzc2FnZSI-DQogIDxkaXYgaXRlbXByb3A9ImFjdGlvbiIgaXRlbXNjb3BlIGl0ZW10eXBlPSJodHRwOi8vc2NoZW1hLm9yZy9WaWV3QWN0aW9uIj4NCiAgICA8bGluayBpdGVtcHJvcD0idXJsIiBocmVmPSJodHRwczovL2dpdGh1Yi5jb20vYXN0YXhpZS9idWlsZC13ZWItYXBwbGljYXRpb24td2l0aC1nb2xhbmcvaXNzdWVzLzM5MiNldmVudC0xOTYxNDczNzciPjwvbGluaz4NCiAgICA8bWV0YSBpdGVtcHJvcD0ibmFtZSIgY29udGVudD0iVmlldyBJc3N1ZSI-PC9tZXRhPg0KICA8L2Rpdj4NCiAgPG1ldGEgaXRlbXByb3A9ImRlc2NyaXB0aW9uIiBjb250ZW50PSJWaWV3IHRoaXMgSXNzdWUgb24gR2l0SHViIj48L21ldGE-DQo8L2Rpdj4NCg=="}}]}}}';


	xhr.send(data);
}

