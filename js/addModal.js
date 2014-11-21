/**
 * 添加添加附件的窗口
 * @return {[DOM Element]}        [插入的窗口]
 */
 
var selected = new Array(); //存储选中的附件
var selIndex = new Array(); //存储选中的附件索引号

Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
Array.prototype.contain = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
    	return(1);
    }
    else {
    	return(-1);
    }
};

function addAtt(att){
  var searchTable=document.getElementById('attTable');
  var row=searchTable.insertRow();
  var c0=row.insertCell(0);
  var c1=row.insertCell(1);
  var c2=row.insertCell(2);
  var c3=row.insertCell(3);
  var c4=row.insertCell(4);
  c0.innerHTML="<input type='checkbox' name='attCheck' />";
  c1.innerHTML=att.messageId;
  c2.innerHTML=att.filename;
  c3.innerHTML=att.url;
  c4.innerHTML=att.partId;
}

function addSel(att){
  var searchTable=document.getElementById('selectTable');
  var row=searchTable.insertRow();
  var c0=row.insertCell(0);
  var c1=row.insertCell(1);
  var c2=row.insertCell(2);
  var c3=row.insertCell(3);
  var c4=row.insertCell(4);
  c0.innerHTML="<input type='checkbox' name='selCheck' />";
  c1.innerHTML=att.messageId;
  c2.innerHTML=att.filename;
  c3.innerHTML=att.url;
  c4.innerHTML=att.partId;
}

function showAtt() {
	//alert("add");
	var inf;
	if (document.getElementById("attTable").rows.length > 1)
		return;
	for (var i = 0; i < attach.length; i++) {
		addAtt(attach[i]);
	}
}

function addSeclet() {
	var flag=0;
	var selectTable=document.getElementById('selectTable');
	var ch=document.getElementsByName('attCheck');
	for(i=0;i<ch.length;i++){
  	var tr=ch[i].parentNode.parentNode;
    var index=tr.rowIndex;
    if(ch[i].checked==true){
	   if (selIndex.contain(index - 1) == -1) {
		    addSel(attach[index - 1]);
		    selected.push(attach[i]);
		   	selIndex.push(i);
		    //alert(selIndex);
		 }
	    flag++;
    }
 	}
   if(flag<=0){
    alert("请选定要添加的附件！");
   }
}

function deleteSelect(){
  var flag=0;
	var selectTable=document.getElementById('selectTable');
	//alert(selectTable);
	var ch=document.getElementsByName('selCheck');
	//alert(ch);
	for(i=ch.length-1;i>=0;i--){
  	var tr=ch[i].parentNode.parentNode;
    var index=tr.rowIndex;
    if(ch[i].checked==true){
	    //alert(selIndex[i]);
	    selected.remove(selIndex[i]);
	    selIndex.remove(selIndex[i]);
	    selectTable.deleteRow(index);
	    flag++;
    }
    //alert(selected);
 	}
   if(flag<=0){
    alert("请选定要删除的附件！");
   }
}

//添加附件
function submitModal() {
	
}

//下载附件
function download() {
	
}
 
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
	
	var install="<div id='iframemodal'><br/><br/><div class='row' style='margin:0px auto; width:1000px; height:500px; border:2px solid gray; overflow:auto'>";
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
		install+="<button class='btn btn-primary btn-middle btn-danger' id='showAtt'>显示全部附件</button>";
		install+="<button class='btn btn-primary btn-middle btn-danger' id='addSeclet'>添加选中附件</button></div></div></div></div>";
		install+="<div class='modal-footer'><div><div><table class='table table-hover table-bordered'pa_ui_name='table,exinput' pa_ui_hover='true'pa_ui_selectable='true' pa_ui_select_mode='multi'pa_ui_select_trigger='tr' pa_ui_select_column='0'pa_ui_select_triggerelement=':checkbox' id='selectTable'><caption><h3>•选中附件列表</h3>";
		install+="</caption><thead><tr><th>选择</th><th>msgId</th><th>文件名</th><th>url</th><th>partId</th></tr></thead><tbody></tbody></table>";
		install+="<div class='btn-group'style='margin: auto; text-align: right;'><button class='btn btn-primary btn-middle btn-danger' id='deleteSelect'>删除选中附件</button><button class='btn btn-primary btn-middle btn-danger' id='submitModal'>添加选中附件到邮件</button><button class='btn btn-primary btn-middle btn-danger' id='download'>下载选中附件</button></div></div></div></div></div></div>";
		
	//alert(install);
	$("div#divmodal").append(install);
	document.getElementById("showAtt").addEventListener("click", showAtt, false);
	document.getElementById("addSeclet").addEventListener("click", addSeclet, false);
	document.getElementById("deleteSelect").addEventListener("click", deleteSelect, false);
	document.getElementById("submitModal").addEventListener("click", submitModal, false);
	document.getElementById("download").addEventListener("click", download, false);
	}
}

	


