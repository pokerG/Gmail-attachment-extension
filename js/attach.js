
var msgs = new Array();

function getAttach() {
	//获取附件的id
	chrome.extension.sendMessage({
		cmd: "get"
	}, function(response) {
		// msgs = response
		console.log("success");
		for (var i = 0; i < response.length; i++) {
			console.log(response[i].msgId);
			console.log(response[i].attachId);
		}

	});
}

function getStorage(){
	chrome.storage.local.get(null,function(result){
		console.log(result);
	});
}
