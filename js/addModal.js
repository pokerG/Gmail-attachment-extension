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
		divBack.setAttribute("class", "KA Kj-JD-Jh");
		divBack.setAttribute("style", "opacity: 0.3; width: 1366px; height: 800px;");
		divBack.setAttribute("aria-hidden" ,"true");
	body.appendChild(divBack);

	var divIframe = document.createElement("div");
		divIframe.setAttribute("class", "KA Kj-JD picker-dialog");
		divIframe.setAttribute("id", "divmodal");
		divIframe.setAttribute("role", "dialog");
		divIframe.setAttribute("style", "opacity: 0.8; width: 1366px; height: 800px; overflow-y:hidden;");
		divIframe.border= "0px";
		
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
				selected.splice(0, selected.length);
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
	
	var install="<div id='iframemodal'><br/><br/><div class='row' style='margin:0px auto; width:600px; height:500px; border:2px solid gray; overflow:auto'>";
		install+="<div class='modal-footer' style='background-color:white;'><div><div class='span3 sidebar'><h2>•附件来源</h2>";
		install+="<select class='multiselect' multiple='multiple'><option value='in'>收件箱</option><option value='out'>发件箱</option>";
		install+="<option value='un'>垃圾箱</option></select></div><div class='span3 sidebar'><h2>•附件搜索</h2><form class='form-search'>";
		install+="<div class='input-append'><input type='text' value='要搜索的附件...' class='span2'>";
		install+="<button type='submit'class='btn btn-primary btn-middle btn-danger'>搜索</button></div></form></div></div>";
		install+="<div class='container-fluid' id='exArea'><div id='ex'><table class='table table-hover table-bordered'pa_ui_name='table,exinput' pa_ui_hover='true'pa_ui_selectable='true' pa_ui_select_mode='multi'pa_ui_select_trigger='tr' pa_ui_select_column='0'pa_ui_select_triggerelement=':checkbox' id='attTable'><caption><h3>•附件列表</h3></caption>";
		install+="<thead><tr><th>选择</th><th>msgId</th><th>文件名</th><th>url</th><th>partId</th></tr></thead><tbody></tbody></table>";
		install+="<div class='pagination'style='margin: auto; width: 480px; text-align: center;'><ul><li><a href='#' style='color: white; background-color: #ee5f5b;'>";
		install+="Prev</a></li><li><a href='#' style='color: blue;'>1</a></li><li><a href='#' style='color: red;'>2</a></li><li><a href='#' style='color: yellow;'>3</a>";
		install+="</li><li><a href='#' style='color: blue;'>4</a></li><li><a href='#' style='color: green;'>5</a></li><li><a href='#' style='color: white; background-color: #ee5f5b;'>Next</a></li></ul></div><div class='btn-group'style='margin: auto; text-align: right;'>";
		install+="<button class='btn btn-primary btn-middle btn-danger' id='showAtt'>显示</button>";
		install+="<button class='btn btn-primary btn-middle btn-danger' onclick='addSeclet();'>添加选中附件</button></div></div></div></div>";
		install+="<div class='modal-footer'><div class='container-fluid'><div><table class='table table-hover table-bordered'pa_ui_name='table,exinput' pa_ui_hover='true'pa_ui_selectable='true' pa_ui_select_mode='multi'pa_ui_select_trigger='tr' ";
		install+="pa_ui_select_column='0'pa_ui_select_triggerelement=':checkbox' id='selectTable'><caption><h3>•选中附件列表</h3>";
		install+="</caption><thead><tr><th>选择</th><th>msgId</th><th>文件名</th><th>url</th><th>partId</th></tr></thead><tbody></tbody></table>";
		install+="<div class='btn-group'style='margin: auto; text-align: right;'><button class='btn btn-primary btn-middle btn-danger' id='deleteEx' onclick='deleteSelect();'>删除选中附件</button><button class='btn btn-primary btn-middle btn-danger' id='submitModal' onclick='submitModal();'>确认</button></div></div></div></div></div></div>";
		
	//alert(install);
	$("div#divmodal").append(install);
	document.getElementById("showAtt").addEventListener("click", showAtt, false);
	}
}

	


