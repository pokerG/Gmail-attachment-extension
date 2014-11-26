/**
 * 向邮件插入搜索附件的按钮
 * @param  {[DOM Element]} parent [新建邮件的div或document]
 * @return {[DOM Element]}        [插入的按钮]
 */

function insert_btn(parent) {
	node = parent.firstChild;

	var element = document.createElement("img");
	url = chrome.extension.getURL("/images/mail_open.png");
	element.setAttribute("src", url);
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
			insert_btn(node);
	}

	nodes = document.querySelectorAll('.aqL');
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i] != null) {
			element = nodes[i].querySelector('#ab32');
			if (element == null)
				insert_btn(nodes[i]);
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