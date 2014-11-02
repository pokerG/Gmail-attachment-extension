
var msgs = new Array();


function getAttach(usrik) {
	var attach = new Array();
	//获取附件的id
	chrome.extension.sendMessage({
		cmd: "get"
	}, function(response) {
		// msgs = response
		console.log("success");
		for (var i = 0; i < response.length; i++) {
			console.log(response[i]);
			console.log("https://mail.google.com/mail/u/0/?ui=2&ik=" + usrik + "&view=att&th=" + response[i].msgId+"&attid=0."+response[i].partId+"&disp=safe&zw");
			url = "https://mail.google.com/mail/u/0/?ui=2&ik=" + usrik + "&view=att&th=" + response[i].msgId+"&attid=0."+response[i].partId+"&disp=safe&zw";
			if(i == 0){
				chrome.extension.sendMessage({
					cmd: "download",
					url: url
				},function(response){});	
			}
		}

	});
}

function getStorage(){
	chrome.storage.local.get(null,function(result){
		console.log(result);
	});
}
