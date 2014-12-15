/**
 * 添加添加附件的窗口
 * @return {[DOM Element]}        [插入的窗口]
 */
function addModal(parent) {
	//alert('add'); 
	body = parent.querySelector(".aAU");
	existModal = parent.querySelector(".KA Kj-JD picker-dialog");
	if (existModal == null) {

		var divBack = document.createElement("div");
		divBack.setAttribute("id", "divBack");
		divBack.setAttribute("class", "KA Kj-JD-Jh");
		divBack.setAttribute("style", "opacity: 0.6; width: 100%; height: 100%; background-color:gray;");
		divBack.setAttribute("aria-hidden", "true");
		body.appendChild(divBack);

		var divIframe = document.createElement("div");
		divIframe.setAttribute("class", "KA Kj-JD picker-dialog");
		divIframe.setAttribute("id", "divmodal");
		divIframe.setAttribute("role", "dialog");
		divIframe.setAttribute("style", "margin:0px auto; width:85%; overflow:auto; left:7%; top:8%; border:2px solid gray; overflow:auto");
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

		var install = "<div id='iframemodal'><br/><br/><div class='row' style='margin:0px auto; width:90%; height:500px;'>";
		install += "<div class='modal-footer' style='background-color:white;'>";
		install += "<div><div class='span10'><form class='form-search'>";
		install += "<div class='input-append'><input id='keyword' type='text' value='要搜索的附件...' class='span10'>";
		install += "<button id = 'search'  class='btn btn-primary btn-middle btn-danger'>搜索</button></form></div></div>";
		install += "<div class='container-fluid' id='exArea'><div id='ex'><table style='table-layout:fixed;word-break: break-all; word-wrap: break-word;' class='table table-hover table-bordered'pa_ui_name='table,exinput' pa_ui_hover='true'pa_ui_selectable='true' pa_ui_select_mode='multi'pa_ui_select_trigger='tr' pa_ui_select_column='0'pa_ui_select_triggerelement=':checkbox' id='attTable'><caption><h3 id='attTitle'>附件列表</h3></caption>";
		install += "<thead><tr><th style='width:30px;' id='_chose'><a hidefocus='' style='hide-focus: true'target='_blank'>选择</a></th><th style='width:30px;' id='_type'><a hidefocus='' style='hide-focus: true'target='_blank'>类型</a></th><th style='width:144px;' id='_name'><a hidefocus='' style='hide-focus: true'target='_blank'>附件名</a></th><th style='width:144px;' id='_subject'><a hidefocus='' style='hide-focus: true'target='_blank'>主题</a></th><th style='width:144px;' id='_from'><a hidefocus='' style='hide-focus: true'target='_blank'>发件人</a></th><th style='width:144px;' id='_to'><a hidefocus='' style='hide-focus: true'target='_blank'>收件人</a></th><th style='width:110px;' id='_date'><a hidefocus='' style='hide-focus: true'target='_blank'>日期</a></th><th style='width:68px;' id='_size'><a hidefocus='' style='hide-focus: true'target='_blank'>大小</a></th></tr></thead><tbody></tbody></table>";
		install += "<div class='pagination'style='margin: auto; width: 480px; text-align: center;'><ul id='changePage'><li><a href='#' style='color: white; background-color: #ee5f5b;' id='prevPage'>";
		install += "Prev</a></li><li><a href='#' style='color: blue;' id='nowPage'>1</a></li><li><a href='#' style='color: white; background-color: #ee5f5b;' id='nextPage'>Next</a></li></ul><ul id='searchPage' style='display:none;'><li><a href='#' style='color: white; background-color: #ee5f5b;' id='searchPrevPage'>";
		install += "Prev</a></li><li><a href='#' style='color: blue;' id='searchNowPage'>1</a></li><li><a href='#' style='color: white; background-color: #ee5f5b;' id='searchNextPage'>Next</a></li></ul></div><div class='btn-group'style='margin: auto; text-align: right;'>";
		install += "<div class='btn-group'style='margin: auto; text-align: right;'><button class='btn btn-primary btn-middle btn-danger' id='secletAll'>全选</button><button class='btn btn-primary btn-middle btn-danger' id='addSeclet'>添加选中附件</button></div></div></div></div></div>";
		install += "<div class='modal-footer'><div><div><table style='table-layout:fixed;word-break: break-all; word-wrap: break-word;'class='table table-hover table-bordered'pa_ui_name='table,exinput' pa_ui_hover='true'pa_ui_selectable='true' pa_ui_select_mode='multi'pa_ui_select_trigger='tr' pa_ui_select_column='0'pa_ui_select_triggerelement=':checkbox' id='selectTable'><caption><h3 id='selTitle'>选中附件列表(0)</h3>";
		install += "</caption><thead><tr><th style='width:30px;'>选择</th><th style='width:30px;'>类型</th><th style='width:144px;'>附件名</th><th style='width:144px;'>主题</th><th style='width:144px;'>发件人</th><th style='width:144px;'>收件人</th><th style='width:110px;'>日期</th><th style='width:68px;'>大小</th></tr></thead><tbody></tbody></table>";
		install += "<div class='btn-group'style='margin: auto; text-align: right;'><button class='btn btn-primary btn-middle btn-danger' id='selectAllSel'>全选</button><button class='btn btn-primary btn-middle btn-danger' id='deleteSelect'>删除选中附件</button><button class='btn btn-primary btn-middle btn-danger' id='submitModal'>创建草稿</button><button class='btn btn-primary btn-middle btn-danger' id='download'>下载选中附件</button></div></div></div></div></div></div>";

		//alert(install);
		$("div#divmodal").append(install);
		document.getElementById("search").addEventListener("click", search, false);
		document.getElementById("secletAll").addEventListener("click", secletAll, false);
		document.getElementById("addSeclet").addEventListener("click", addSeclet, false);
		document.getElementById("selectAllSel").addEventListener("click", selectAllSel, false);
		document.getElementById("deleteSelect").addEventListener("click", deleteSelect, false);
		document.getElementById("prevPage").addEventListener("click", desPage, false);
		document.getElementById("nextPage").addEventListener("click", incPage, false);
		document.getElementById("searchPrevPage").addEventListener("click", searchDesPage, false);
		document.getElementById("searchNextPage").addEventListener("click", searchIncPage, false);
		document.getElementById("submitModal").addEventListener("click", submitModal, false);
		document.getElementById("download").addEventListener("click", download, false);
		document.getElementById("keyword").addEventListener("blur", disKey, false);
		document.getElementById("keyword").addEventListener("focus", showKey, false);
		document.getElementById("_chose").addEventListener("click", choseSort, false);
		document.getElementById("_type").addEventListener("click", typeSort, false);
		document.getElementById("_name").addEventListener("click", nameSort, false);
		document.getElementById("_subject").addEventListener("click", subjectSort, false);
		document.getElementById("_from").addEventListener("click", fromSort, false);
		document.getElementById("_to").addEventListener("click", toSort, false);
		document.getElementById("_date").addEventListener("click", dateSort, false);
		document.getElementById("_size").addEventListener("click", sizeSort, false);

	}
}