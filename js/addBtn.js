/**
 * 向邮件插入搜索附件的按钮
 * @param  {[DOM Element]} parent [新建邮件的div或document]
 * @return {[DOM Element]}        [插入的按钮]
 */
function insert_btn(parent) {
	toolbar = parent.querySelector(".pXSFsb"); //邮件的附件,图片工具栏
	if (toolbar == null) {
		return;
	}

	node = toolbar.children[0];
	if (node.childElementCount == 5) { //判断是否已添加Btn
		var element = document.createElement("img");
		url = chrome.extension.getURL("/images/mail_open.png");
		element.setAttribute("src", url);
		element.setAttribute("name", "attachBtn");
		element.setAttribute("id", "ab");
		element.setAttribute("class", "atB")
		// element.innerText = "attach";
		node.appendChild(element);
		element.addEventListener("click", attachClick, false);
		return element;
	}
}

document.onmousemove = function() {
	reply = document.querySelector('.Am,.aO9,.Al,.editable,.LW-avf'); //回复
	newemail = document.querySelectorAll('.AD'); //新邮件
	if (reply != null) {
		if (document.activeElement.className == reply.className) {
			insert_btn(document);

		}
	}
	for (var i = 0; i < newemail.length; i++) {
		insert_btn(newemail[i]);
		// document.getElementById('ab').addEventListener("click", test, false);
	}

}

/**
 * 按钮click事件,其中调用各种处理函数
 * @param  {[事件]} e [事件 e.target为DOM element]
 */
function attachClick(e){
	getAttach();
	// getStorage();
}

