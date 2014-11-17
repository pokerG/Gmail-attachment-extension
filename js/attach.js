var msgs = new Array();
var attach = new Array();
/**
 * 获取附件
 * @param  {[string]} usrik [user's ik]
 * @param  {[string]} q 	[query term]                     
 */
function getAttach(usrik) {

	//从background获得附件信息
	chrome.extension.sendMessage({
		cmd: "get",
	}, function(response) {
		msgs = response;
		console.log("success");
		for (var i = 0; i < response.length; i++) {
			console.log(response[i]);
			console.log("https://mail.google.com/mail/u/0/?ui=2&ik=" + usrik + "&view=att&th=" + response[i].msgId + "&attid=0." + response[i].partId + "&disp=safe&zw");
			url = "https://mail.google.com/mail/u/0/?ui=2&ik=" + usrik + "&view=att&th=" + response[i].msgId + "&attid=0." + response[i].partId + "&disp=safe&zw";
			attach[attach.length] = {
					messageId: response[i].msgId,
					filename: response[i].filename,
					attachmentId: response[i].attachmentId,
					url: url
				}
				/*if(i == 0){
					chrome.extension.sendMessage({
						cmd: "download",
						url: url
					},function(response){});	
				}*/
		}

	});
}

function getStorage() {
	chrome.storage.local.get(null, function(result) {
		console.log(result);
	});
}