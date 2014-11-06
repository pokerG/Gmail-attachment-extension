/**
 * 添加添加附件的窗口
 * @return {[DOM Element]}        [插入的窗口]
 */
function addModal(parent) {
	body = parent.querySelector(".aAU");
	existModal = parent.querySelector(".attachModal");
	if (existModal == null) {
	
	var divBack = document.createElement("div");
		divBack.setAttribute("class", "KA Kj-JD-Jh");
		divBack.setAttribute("style", "opacity: 0.5; width: 1366px; height: 352px;");
		divBack.setAttribute("aria-hidden" ,"true");
	body.appendChild(divBack);

	var divIframe = document.createElement("div");
		divIframe.setAttribute("class", "divIframe");
		divIframe.setAttribute("style", "opacity: 0.5; width: 1366px; height: 352px;");
		var ifr = document.createElement("iframe");
			ifr.setAttribute("id", "iframemodal");
			ifr.setAttribute("name", "modal");
			ifr.setAttribute("class", "KA-JQ");
			ifr.setAttribute("style.display", "block");
			var iframeURL = chrome.extension.getURL('page/addEx.html');
			ifr.onload = function() {   
   			 alert('loaded');   
			}; 
			ifr.setAttribute("src", iframeURL);
		divIframe.appendChild(ifr);
	body.appendChild(divIframe);


	}
}


