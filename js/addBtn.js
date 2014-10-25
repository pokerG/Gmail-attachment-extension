function insert_btn(parent) {
	toolbar = parent.querySelector(".pXSFsb"); //邮件的附件,图片工具栏
	if (toolbar == null) {
		return;
	}

	node = toolbar.children[0];
	if (node.childElementCount == 5) { //判断是否已添加Btn
		var element = document.createElement("button");
		element.setAttribute("name", "generate_btn");
		element.setAttribute("id", "test_btn");
		element.setAttribute("class", "btn")
		element.innerText = "test";
		node.appendChild(element);
		state = true;
		element.onclick = "test()";
		return element;
	}
}
document.onmousemove = function() {
	reply = document.querySelector('.Am,.aO9,.Al,.editable,.LW-avf'); //回复
	newemail = document.querySelectorAll('.AD');	//新邮件
	if (reply != null) {
		if (document.activeElement.className == reply.className) {
			insert_btn(document);
		}
	}
	for (var i = 0; i < newemail.length; i++) {
		insert_btn(newemail[i]);
	}
}


function test() {
	console.log("hello");
}