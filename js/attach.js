var msgs = new Array();
var attach = new Array();
/**
 * 获取附件
 */
function getAttach() {

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
					partId: response[i].partId,
					attachmentId: response[i].attachmentId,
					size : response[i].size,
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

function addAttachment() {
	chrome.extension.sendMessage({
		cmd: "draft",
	}, function(response) {
		msgId = response.message.id;

		pdiv = document.createElement("div");
		pdiv.setAttribute("class", "dL");
		pdiv.setAttribute("tabindex", "-1");
		pdiv.setAttribute("id", ":ny");
		pdiv.setAttribute("aria-label", "附件："+ attach[0].filename + "。按 Enter 键可查看附件，按 Delete 键可将其移除");

		cinput = document.createElement("input");
		cinput.setAttribute("id", ":nq");
		cinput.setAttribute("name", "attach");
		cinput.setAttribute("type", "hidden");
		cinput.setAttribute("value", msgId + "_" + msgId + "_0.1_-1");
		cinput.setAttribute("checked", "");
		pdiv.appendChild(cinput);

		ca = document.createElement("a");
		ca.setAttribute("class", "dO");
		ca.setAttribute("id", ":nr");
		ca.setAttribute("href", "?ui=2&ik="+ usrik + "&view=att&th=" + attach[0].messageId + "&attid=0." + attach[0].partId + "&disp=safe&zw");
		ca.setAttribute("target", "_blank");
		pdiv.appendChild(ca);
		cdiv1 = document.createElement("div");
		cdiv1.setAttribute("class", "vI");
		cdiv1.innerText = attach[0].filename;
		ca.appendChild(cdiv1);
		cdiv2 = document.createElement("div");
		cdiv2.setAttribute("class", "vJ");
		cdiv2.innerText = "(1 K)";
		ca.appendChild(cdiv2);
		cdiv3 = document.createElement("div");
		cdiv3.setAttribute("id", ":no");
		cdiv3.setAttribute("role", "button");
		cdiv3.setAttribute("class", "vq");
		cdiv3.setAttribute("tabindex", "-1");
		pdiv.appendChild(cdiv3);

		gm = document.querySelector(".GM");
		d = document.createElement("div");
		gm.children[0].appendChild(d);
		d.appendChild(pdiv);
	});
}