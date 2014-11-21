var selected = new Array(); //存储选中的附件

var showAtt=document.getElementById('showAtt');
var addSelect=document.getElementById('addSelect');
var deleteSelect=document.getElementById('deleteSelect');
var submitModal=document.getElementById('submitModal');

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

showAtt.click=function addAtt(att){
  var searchTable=document.getElementById('attTable');
  var row=searchTable.insertRow();
  var c0=row.insertCell(0);
  var c1=row.insertCell(1);
  var c2=row.insertCell(2);
  var c3=row.insertCell(3);
  var c4=row.insertCell(4);
  c0.innerHTML="<input type='checkbox' name='attCheck' />";
  c1.innerHTML=att.msgId;
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
  c1.innerHTML=att.msgId;
  c2.innerHTML=att.filename;
  c3.innerHTML=att.url;
  c4.innerHTML=att.partId;
}

function showAtt() {
	var inf;
	if (document.getElementById("attTable").rows.length > 1)
		return;
	for (var i = 0; i < attach.length; i++) {
		//selected.push(attach[i].msgId);
		addAtt(attach[i]);
	}
}

addSelect.onclick=function addSeclet() {
	var flag=0;
	var selectTable=document.getElementById('selectTable');
	var ch=document.getElementsByName('attCheck');
	for(i=0;i<ch.length;i++){
  	var tr=ch[i].parentNode.parentNode;
    var index=tr.rowIndex;
    if(ch[i].checked==true){
	    if (selected.contain(attach[index - 1].msgId) == -1) {
		    addSel(attach[index - 1]);
		    selected.push(attach[i].msgId);
		  }
	    //alert(selected);
	    //tb.deleteRow(index);
	    flag++;
    }
 	}
   if(flag<=0){
    alert("请选定要添加的附件！");
   }
}

deleteSelect.onclick=function deleteSelect(){
  var flag=0;
	var selectTable=document.getElementById('selectTable');
	//alert(selectTable);
	var ch=document.getElementsByName('selCheck');
	//alert(ch);
	for(i=ch.length-1;i>=0;i--){
  	var tr=ch[i].parentNode.parentNode;
    var index=tr.rowIndex;
    if(ch[i].checked==true){
	    //alert(selectTable.rows[index].cells[1].innerHTML);
	    selected.remove(selectTable.rows[index].cells[1].innerHTML);
	    selectTable.deleteRow(index);
	    flag++;
    }
    //alert(selected);
 	}
   if(flag<=0){
    alert("请选定要删除的附件！");
   }
}

submitModal.onclick=function submitModal() {
	
}