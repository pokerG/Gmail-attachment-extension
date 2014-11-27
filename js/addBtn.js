/**
 * [插入附件管理按钮]
 * @param  {DOM Element} parent 插入的位置
 * @param  {Boolean} down   是否需要再往下一层
 * @return {DOM Element}        插入的按钮
 */
function insert_btn(parent,down) {

	node = parent.firstChild;
	if(down){
		node = node.firstChild;
	}
	var element = document.createElement("img");
	url = chrome.extension.getURL("/images/mail_open.png");
	element.setAttribute("src", url);
	element.setAttribute("alt","附件管理");
	element.setAttribute("name", "attachBtn");
	element.setAttribute("id", "ab32");
	element.setAttribute("class", "atB");
	element.setAttribute("tabindex", "1");
	element.setAttribute("role", "button");
	element.setAttribute("aria-pressed", "false");
	element.setAttribute("aria-haspopup", "true");
	element.setAttribute("aria-expanded", "false");
	element.setAttribute("style", "-webkit-user-select: none;");
	element.addEventListener("click", attachClick, false);

	node.appendChild(element);
	return element;
}

document.onmousemove = function() {
	node = document.querySelector('.iH'); //回复


	if (node != null) {
		element = node.querySelector('#ab32');
		if (element == null)
			insert_btn(node,false);
	}

	nodes = document.querySelectorAll('.aqL');
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i] != null) {
			element = nodes[i].querySelector('#ab32');
			if (element == null)
				insert_btn(nodes[i],true);
		}
	}
}

/**
 * 按钮click事件,其中调用各种处理函数
 * @param  {[事件]} e [事件 e.target为DOM element]
 */
function attachClick(e) {
	getAttach();
	// getStorage();
}