/**
 * 添加添加附件的窗口
 * @return {[DOM Element]}        [插入的窗口]
 */

var selected = new Array(); //存储选中的附件
var selIndex = new Array(); //存储选中的附件索引号
var pageAttNum = 10;
var pageNum = 0;

Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) return i;
	}
	return -1;
};
Array.prototype.contain = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		return (1);
	} else {
		return (-1);
	}
};

function changeSize(size) {
	if (size < Math.pow(1024, 2))
		return ((size / 1024).toFixed(2) + "KB");
	else if (size < Math.pow(1024, 3))
		return ((size / Math.pow(1024, 2)).toFixed(2) + "MB");
	else
		return ((size / Math.pow(1024, 3)).toFixed(2) + "GB");
}

function addAtt(att) {
	var searchTable = document.getElementById('attTable');
	var row = searchTable.insertRow();
	var c0 = row.insertCell(0);
	var c1 = row.insertCell(1);
	var c2 = row.insertCell(2);
	var c3 = row.insertCell(3);
	c0.innerHTML = "<input type='checkbox' name='attCheck' />";
	c1.innerHTML = att.filename;
	c2.innerHTML = att.mimeType;
	c3.innerHTML = changeSize(att.size);
	return (row);
}

function addSel(att) {
	var searchTable = document.getElementById('selectTable');
	var row = searchTable.insertRow();
	var c0 = row.insertCell(0);
	var c1 = row.insertCell(1);
	var c2 = row.insertCell(2);
	var c3 = row.insertCell(3);
	c0.innerHTML = "<input type='checkbox' name='selCheck' />";
	c1.innerHTML = att.filename;
	c2.innerHTML = att.mimeType;
	c3.innerHTML = changeSize(att.size);
}

//分页
function page() {
	var searchTable = document.getElementById('attTable');
	var pageLen, st, ed, row, i;
	for (i = 1; i < searchTable.rows.length; i++) {
		row = searchTable.rows[i];
		row.style.display = "none";
	}
	st = pageNum * pageAttNum;
	ed = st + pageAttNum;
	//alert(st + " " + ed);
	if (searchTable.rows.length - 1 < ed)
		ed = searchTable.rows.length - 1;
	for (i = st; i < ed; i++) {
		row = document.getElementById("att" + i);
		row.style.display = searchTable.style.display;
	}
	document.getElementById("nowPage").innerHTML = pageNum + 1;
}

function desPage() {
	var pre = document.getElementById("prevPage");
	pre.disabled = false;
	if (pageNum == 0)
		pre.disbled = true;
	//alert("无前一页!");
	else {
		pageNum--;
		//alert(pageNum);
		page();
	}
}

function incPage() {
	var nex = document.getElementById("nextPage");
	nex.disabled = false;
	var searchTable = document.getElementById('attTable');
	if (Math.ceil((searchTable.rows.length - 1) / pageAttNum) == pageNum + 1)
		nex.disabled = true;
	//alert("无后一页");
	else {
		pageNum++;
		//alert(pageNum);
		page();
	}
}

function showAtt() {
	//alert("add");
	var inf;
	if (document.getElementById("attTable").rows.length > 1)
		return;
	for (var i = 0; i < attach.length; i++) {
		row = addAtt(attach[i]);
		row.id = "att" + i;
		//alert(row.id);
	}
	page();
}

function addSeclet() {
	var flag = 0;
	var selectTable = document.getElementById('selectTable');
	var ch = document.getElementsByName('attCheck');
	for (i = 0; i < ch.length; i++) {
		var tr = ch[i].parentNode.parentNode;
		var index = tr.rowIndex;
		if (ch[i].checked == true) {
			if (selIndex.contain(index - 1) == -1) {
				addSel(attach[index - 1]);
				selected.push(attach[i]);
				selIndex.push(i);
				//alert(selIndex);
			}
			flag++;
			ch[i].checked = false;
		}
	}
	if (flag <= 0) {
		alert("请选定要添加的附件！");
	}
}

function deleteSelect() {
	var flag = 0;
	var selectTable = document.getElementById('selectTable');
	//alert(selectTable);
	var ch = document.getElementsByName('selCheck');
	//alert(ch);
	for (i = ch.length - 1; i >= 0; i--) {
		var tr = ch[i].parentNode.parentNode;
		var index = tr.rowIndex;
		if (ch[i].checked == true) {
			//alert(selIndex[i]);
			selected.splice(i, 1);
			selIndex.splice(i, 1);
			selectTable.deleteRow(index);
			flag++;
		}
		//alert(selected);
	}
	if (flag <= 0) {
		alert("请选定要删除的附件！");
	}
}

function search() {
	var keyword = document.querySelector('#keyword').value;

	var at = document.getElementById("attTable")
	var rowNum = at.rows.length
	for (var i = rowNum - 1; i > 0; i--) {
		at.deleteRow(i);
	}
	if (keyword != "") {
		reg = eval("/" + keyword + "/ig");
		for (var i = 0; i < attach.length; i++) {
			if (attach[i].filename.search(reg) != -1) {
				addAtt(attach[i]);
			}
		}
		// page();
	}else{
		showAtt();
	}


}

//添加附件
function submitModal() {
	chrome.extension.sendMessage({
		cmd: "draft",
		attachs: selected
	}, function(response) {
		alert(response);
	});
	//创建草稿后关闭
	body.removeChild(document.getElementById("divBack"));
	body.removeChild(document.getElementById("divmodal"));
	selected.splice(0, selected.length);
	selIndex.splice(0, selIndex.length);
}

//下载附件
function download() {
	for (var i = 0; i < selected.length; i++) {
		chrome.extension.sendMessage({
			cmd: "download",
			url: selected[i].url
		}, function(response) {});
	}
}

function addModal(parent) {
	//alert('add'); 
	body = parent.querySelector(".aAU");
	existModal = parent.querySelector(".KA Kj-JD picker-dialog");
	if (existModal == null) {

		var divBack = document.createElement("div");
		divBack.setAttribute("id", "divBack");
		divBack.setAttribute("class", "KA Kj-JD-Jh");
		divBack.setAttribute("style", "opacity: 0.6; width: 1366px; height: 800px; background-color:gray;");
		divBack.setAttribute("aria-hidden", "true");
		body.appendChild(divBack);

		var divIframe = document.createElement("div");
		divIframe.setAttribute("class", "KA Kj-JD picker-dialog");
		divIframe.setAttribute("id", "divmodal");
		divIframe.setAttribute("role", "dialog");
		divIframe.setAttribute("style", "margin:0px auto; width:1020px; overflow:auto; left:150px; top:50px; border:2px solid gray; overflow:auto");
		divIframe.border = "0px";

		var clsbut = document.createElement("img");
		url = chrome.extension.getURL("/images/closeModal.png");
		clsbut.setAttribute("src", url);
		clsbut.setAttribute("align", "right");
		clsbut.setAttribute("class", "clB");
		clsbut.setAttribute("tabindex", "1");
		clsbut.setAttribute("role", "button");
		clsbut.setAttribute("aria-pressed", "false");
		clsbut.setAttribute("aria-haspopup", "true");
		clsbut.setAttribute("aria-expanded", "false");
		clsbut.setAttribute("style", "-webkit-user-select: none;");
		clsbut.onclick = function() {
			body.removeChild(divBack);
			body.removeChild(divIframe);
			//点右上角退出会清空selected和selIndex
			selected.splice(0, selected.length);
			selIndex.splice(0, selIndex.length);
		}
		divIframe.appendChild(clsbut);

		/*var ifr = document.createElement("iframe");
			ifr.setAttribute("id", "iframemodal");
			ifr.setAttribute("name", "modal");
			ifr.setAttribute("class", "KA-JQ");
			ifr.setAttribute("frameborder", "0");
			ifr.setAttribute("tabindex", "0");
			var iframeURL = chrome.extension.getURL('../addEx.html');
			ifr.setAttribute("src", iframeURL);
		divIframe.appendChild(ifr);*/
		body.appendChild(divIframe);

		//alert("ok");

		var install = "<div id='iframemodal'><br/><br/><div class='row' style='margin:0px auto; width:1000px; height:500px;'>";
		install += "<div class='modal-footer' style='background-color:white;'>";
		install += "<div><div class='span10'><form class='form-search'>";
		install += "<div class='input-append'><input id='keyword' type='text' value='要搜索的附件...' class='span10'>";
		install += "<button id = 'search' type='submit' class='btn btn-primary btn-middle btn-danger'>搜索</button></form></div></div>";
		install += "<div class='container-fluid' id='exArea'><div id='ex'><table class='table table-hover table-bordered'pa_ui_name='table,exinput' pa_ui_hover='true'pa_ui_selectable='true' pa_ui_select_mode='multi'pa_ui_select_trigger='tr' pa_ui_select_column='0'pa_ui_select_triggerelement=':checkbox' id='attTable'><caption><h3>附件列表</h3></caption>";
		install += "<thead><tr><th>选择</th><th>附件名</th><th>附件类型</th><th>附件大小</th><th>Subject</th><th>From</th><th>To</th><th>Date</th></tr></thead><tbody></tbody></table>";
		install += "<div class='pagination'style='margin: auto; width: 480px; text-align: center;'><ul id='changePage'><li><a href='#' style='color: white; background-color: #ee5f5b;' id='prevPage'>";
		install += "Prev</a></li><li><a href='#' style='color: blue;' id='nowPage'>1</a></li><li><a href='#' style='color: white; background-color: #ee5f5b;' id='nextPage'>Next</a></li></ul></div><div class='btn-group'style='margin: auto; text-align: right;'>";
		install += "<button class='btn btn-primary btn-middle btn-danger' id='addSeclet'>添加选中附件</button></div></div></div></div>";
		install += "<div class='modal-footer'><div><div><table class='table table-hover table-bordered'pa_ui_name='table,exinput' pa_ui_hover='true'pa_ui_selectable='true' pa_ui_select_mode='multi'pa_ui_select_trigger='tr' pa_ui_select_column='0'pa_ui_select_triggerelement=':checkbox' id='selectTable'><caption><h3>选中附件列表</h3>";
		install += "</caption><thead><tr><th>选择</th><th>附件名</th><th>附件类型</th><th>附件大小</th><th>Subject</th><th>From</th><th>To</th><th>Date</th></tr></thead><tbody></tbody></table>";
		install += "<div class='btn-group'style='margin: auto; text-align: right;'><button class='btn btn-primary btn-middle btn-danger' id='deleteSelect'>删除选中附件</button><button class='btn btn-primary btn-middle btn-danger' id='submitModal'>创建草稿</button><button class='btn btn-primary btn-middle btn-danger' id='download'>下载选中附件</button></div></div></div></div></div></div>";

		//alert(install);
		$("div#divmodal").append(install);
		document.getElementById("search").addEventListener("click", search, false);
		document.getElementById("addSeclet").addEventListener("click", addSeclet, false);
		document.getElementById("deleteSelect").addEventListener("click", deleteSelect, false);
		document.getElementById("prevPage").addEventListener("click", desPage, false);
		document.getElementById("nextPage").addEventListener("click", incPage, false);
		document.getElementById("submitModal").addEventListener("click", submitModal, false);
		document.getElementById("download").addEventListener("click", download, false);

	}
}