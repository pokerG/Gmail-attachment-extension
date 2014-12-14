var selected = new Array(); //存储选中的附件
var selIndex = new Array(); //存储选中的附件索引号
var searchIndex = new Array(); //存储搜索到的附件索引号
var pageAttNum = 10;
var pageNum = 0;
var searchPageNum = 0;
var keyFlag = 1;
var sort = new Array();
var sortFlag = true;
var searchFlag = false;
var selectAllFlag = false;
var selAllFlag = false;

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

function scrollTop() {
	var frame = document.getElementById('divmodal');
	frame.scrollTop = 0;
	//alert("top");
}

function scrollBottom() {
	var frame = document.getElementById('divmodal');
	frame.scrollTop = frame.scrollHeight;
	//alert("donw");
}

function changeSize(size) {
	if (size < Math.pow(1024, 2))
		return ((size / 1024).toFixed(2) + " KB");
	else if (size < Math.pow(1024, 3))
		return ((size / Math.pow(1024, 2)).toFixed(2) + " MB");
	else
		return ((size / Math.pow(1024, 3)).toFixed(2) + " GB");
}

function changeDate(date) {
	var dat0 = date.split(', ');
	var dat1 = dat0[1].split(' ');
	var month = dat1[1];
	var day = dat0[0];
	switch (dat1[1]) {
		case 'Jan':
			month = '01';
			break;
		case 'Feb':
			month = '02';
			break;
		case 'Mar':
			month = '03';
			break;
		case 'Apr':
			month = '04';
			break;
		case 'May':
			month = '05';
			break;
		case 'Jun':
			month = '06';
			break;
		case 'Jul':
			month = '07';
			break;
		case 'Aug':
			month = '08';
			break;
		case 'Sep':
			month = '09';
			break;
		case 'Oct':
			month = '10';
			break;
		case 'Nov':
			month = '11';
			break;
		case 'Dec':
			month = '12';
			break;
	}
	switch (dat0[0]) {
		case 'Mon':
			day = '星期一';
			break;
		case 'Tue':
			day = '星期二';
			break;
		case 'Wed':
			day = '星期三';
			break;
		case 'Thu':
			day = '星期四';
			break;
		case 'Fri':
			day = '星期五';
			break;
		case 'Sat':
			day = '星期六';
			break;
		case 'Sun':
			day = '星期日';
			break;
	}
	var newDate = dat1[2] + '年' + month + '月' + dat1[0] + '日' + dat1[3] + ' ' + day;
	return (newDate);
}

function checkAll() {
	var searchTable = document.getElementById('attTable');
	var i, vis, che, row;
	vis = 0;
	che = 0;
	for (i = 1; i < searchTable.rows.length; i++) {
		row = searchTable.rows[i];
		if (row.style.display != 'none') {
			vis++;
			if (row.cells[0].children[0].checked)
				che++;
		}
	}
	//alert(vis + " " + che);
	var selBut = document.getElementById('secletAll');
	if (vis != che) {
		selectAllFlag = false;
		selBut.innerHTML = "全选";
	} else {
		selectAllFlag = true;
		selBut.innerHTML = "全不选";
	}
}

function checkAllSel() {
	var selectTable = document.getElementById('selectTable');
	var i, vis, che, row;
	vis = 0;
	che = 0;
	for (i = 1; i < selectTable.rows.length; i++) {
		row = selectTable.rows[i];
		if (row.style.display != 'none') {
			vis++;
			if (row.cells[0].children[0].checked)
				che++;
		}
	}
	//alert(vis + " " + che);
	var selBut = document.getElementById('selectAllSel');
	if (vis != che) {
		selAllFlag = false;
		selBut.innerHTML = "全选";
	} else {
		selAllFlag = true;
		selBut.innerHTML = "全不选";
	}
}

function addAtt(att) {
	var searchTable = document.getElementById('attTable');
	dat = att.date.split('+');
	dat = dat[0].split('-');
	var row = searchTable.insertRow();
	var c0 = row.insertCell(0);
	var c1 = row.insertCell(1);
	var c2 = row.insertCell(2);
	var c3 = row.insertCell(3);
	var c4 = row.insertCell(4);
	var c5 = row.insertCell(5);
	var c6 = row.insertCell(6);
	var c7 = row.insertCell(7);
	c0.innerHTML = "<input type='checkbox' name='attCheck'/>";
	c0.children[0].addEventListener("change", checkAll, false);
	c2.innerHTML = att.filename;
	c1.innerHTML = att.type;
	c7.innerHTML = changeSize(att.size);
	c3.innerHTML = att.subject;
	c4.innerHTML = att.from;
	tos = att.to.split(","); //Too much info replaced with ...
	if (tos.length > 3) {
		c5.innerHTML = tos[0] + "," + tos[1] + "," + tos[2] + "...";
	} else {
		c5.innerHTML = att.to;
	}
	c6.innerHTML = changeDate(dat[0]);
	return (row);
}

function addSel(att) {
	var searchTable = document.getElementById('selectTable');
	dat = att.date.split('+');
	dat = dat[0].split('-');
	var row = searchTable.insertRow();
	var c0 = row.insertCell(0);
	var c1 = row.insertCell(1);
	var c2 = row.insertCell(2);
	var c3 = row.insertCell(3);
	var c4 = row.insertCell(4);
	var c5 = row.insertCell(5);
	var c6 = row.insertCell(6);
	var c7 = row.insertCell(7);
	c0.innerHTML = "<input type='checkbox' name='selCheck'/>";
	c0.children[0].addEventListener("change", checkAllSel, false);
	c2.innerHTML = att.filename;
	c1.innerHTML = att.type;
	c7.innerHTML = changeSize(att.size);
	c3.innerHTML = att.subject;
	c4.innerHTML = att.from;
	tos = att.to.split(","); //Too much info replaced with ...
	if (tos.length > 3) {
		c5.innerHTML = tos[0] + "," + tos[1] + "," + tos[2] + "...";
	} else {
		c5.innerHTML = att.to;
	}
	c6.innerHTML = changeDate(dat[0]);
	return (row);
}

//分页
function page() {
	selectAllFlag = false;
	var selBut = document.getElementById('secletAll');
	selBut.innerHTML = "全选";
	var searchTable = document.getElementById('attTable');
	var pageLen, st, ed, row, i;
	for (i = 1; i < searchTable.rows.length; i++) {
		row = searchTable.rows[i];
		row.style.display = "none";
		row.cells[0].children[0].checked = false;
	}
	st = pageNum * pageAttNum;
	ed = st + pageAttNum;
	//alert(st + " " + ed);
	if (searchTable.rows.length - 1 < ed)
		ed = searchTable.rows.length - 1;
	for (i = st; i < ed; i++) {
		row = searchTable.rows[i + 1]; //document.getElementById("att" + i);
		row.style.display = searchTable.style.display;
	}
	document.getElementById("nowPage").innerHTML = pageNum + 1;
	var attTitle = document.getElementById("attTitle");
	attTitle.innerHTML = attTitle.innerHTML.split('(')[0] + "(" + attach.length + ")";
	scrollTop();
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
	searchFlag = false;
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

function secletAll() {
	var i, row, count;
	var searchTable = document.getElementById('attTable');
	var selBut = document.getElementById('secletAll');
	count = 0;
	for (i = 1; i < searchTable.rows.length; i++) {
		row = searchTable.rows[i];
		if (row.style.display == searchTable.style.display)
			count++;
		if (!selectAllFlag)
			row.cells[0].children[0].checked = true;
		else
			row.cells[0].children[0].checked = false;
	}
	//alert(count);
	if (selBut.innerHTML == "全选")
		selBut.innerHTML = "全不选";
	else
		selBut.innerHTML = "全选";
	selectAllFlag = !selectAllFlag;
	//空表情况
	if (count == 0) {
		selBut.innerHTML = "全选";
		selectAllFlag = false;
	}
}

function addSeclet() {
	selectAllFlag = false;
	var selBut = document.getElementById('secletAll');
	selBut.innerHTML = "全选";
	var flag = 0;
	var selectTable = document.getElementById('selectTable');
	var ch = document.getElementsByName('attCheck');
	for (i = 0; i < ch.length; i++) {
		var tr = ch[i].parentNode.parentNode;
		var index = parseInt(tr.id.split('tt')[1]);
		if (ch[i].checked == true && tr.style.display == selectTable.style.display) {
			if (selIndex.contain(index) == -1) {
				var row = addSel(attach[index]);
				row.id = "sel" + index;
				selected.push(attach[index]);
				selIndex.push(index);
			}
			flag++;
			ch[i].checked = false;
		}
	}
	//alert(flag);
	if (flag <= 0) {
		//alert("请选定要添加的附件！");
	}
	var selTitle = document.getElementById("selTitle");
	selTitle.innerHTML = selTitle.innerHTML.split('(')[0] + "(" + selected.length + ")";
	scrollBottom();
}

function selectAllSel() {
	var i, row;
	var selTable = document.getElementById('selectTable');
	var selBut = document.getElementById('selectAllSel');
	//空表情况
	if (selTable.rows.length == 1)
		return;
	for (i = 1; i < selTable.rows.length; i++) {
		row = selTable.rows[i];
		if (row.style.display == selTable.style.display)
			if (!selAllFlag)
				row.cells[0].children[0].checked = true;
			else
				row.cells[0].children[0].checked = false;
	}
	if (selBut.innerHTML == "全选")
		selBut.innerHTML = "全不选";
	else
		selBut.innerHTML = "全选";
	selAllFlag = !selAllFlag;
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
			//alert(index);
			//alert(tr.id);
			flag++;
		}
		//alert(selected);
	}
	if (flag <= 0) {
		//alert("请选定要删除的附件！");
	}
	var selTitle = document.getElementById("selTitle");
	selTitle.innerHTML = selTitle.innerHTML.split('(')[0] + "(" + selected.length + ")";
	if (selectTable.rows.length == 1) {
		var selBut = document.getElementById('selectAllSel');
		selBut.innerHTML = "全选";
		selAllFlag = false;
	}
}

//搜索分页
function doSearchPage() {
	selectAllFlag = false;
	var selBut = document.getElementById('secletAll');
	selBut.innerHTML = "全选";
	var searchTable = document.getElementById('attTable');
	var pageLen, st, ed, row, i;
	for (i = 1; i < searchTable.rows.length; i++) {
		row = searchTable.rows[i];
		row.style.display = "none";
		row.cells[0].children[0].checked = false;
	}
	var sNum = searchIndex.length;
	st = searchPageNum * pageAttNum;
	ed = st + pageAttNum;
	if (sNum < ed)
		ed = sNum;
	//alert(st + " " + ed);
	document.getElementById("searchNowPage").innerHTML = searchPageNum + 1;
	scrollTop();
	for (i = st; i < ed; i++) {
		row = document.getElementById("att" + searchIndex[i]);
		row.style.display = searchTable.style.display;
	}
}

function searchDesPage() {
	var pre = document.getElementById("searchPrevPage");
	pre.disabled = false;
	if (searchPageNum == 0)
		pre.disbled = true;
	//alert("无前一页!");
	else {
		searchPageNum--;
		//alert(pageNum);
		doSearchPage();
	}
}

function searchIncPage() {
	var nex = document.getElementById("searchNextPage");
	nex.disabled = false;
	var searchTable = document.getElementById('attTable');
	if (Math.ceil((searchIndex.length) / pageAttNum) == searchPageNum + 1)
		nex.disabled = true;
	//alert("无后一页");
	else {
		searchPageNum++;
		//alert(pageNum);
		doSearchPage();
	}
}

function search() {
	searchFlag = true;
	var row;
	var changePage = document.getElementById("changePage");
	var searchPage = document.getElementById("searchPage");
	var keyword = document.querySelector('#keyword').value;
	var at = document.getElementById("attTable")
	var rowNum = at.rows.length
		//alert(rowNum);
	for (var i = 1; i < rowNum; i++) {
		row = at.rows[i];
		row.style.display = "none";
	}
	if (keyword != "要搜索的附件...") {
		searchIndex.splice(0, searchIndex.length);
		searchitem = keyword.split(":"); //condition search
		if (searchitem.length == 1) {
			reg = eval("/" + keyword + "/ig");
			for (var i = 0; i < attach.length; i++) {
				if (attach[i].filename.search(reg) != -1) {
					searchIndex.push(i);
					//row = document.getElementById("att" + i);
					//row.style.display = at.style.display;
				}
			}
		} else {
			keyword = searchitem[1];
			for (var i = 2; i < searchitem.length; i++) { //maybe there are : in name
				keyword += ":" + searchitem[i];
			}
			reg = eval("/" + keyword + "/ig");
			switch (searchitem[0]) {
				case 'type':
					for (var i = 0; i < attach.length; i++) {
						if (attach[i].type.search(reg) != -1) {
							searchIndex.push(i);
						}
					}
					break;
				case 'name':
					for (var i = 0; i < attach.length; i++) {
						if (attach[i].filename.search(reg) != -1) {
							searchIndex.push(i);
						}
					}
					break;
				case 'subject':
					for (var i = 0; i < attach.length; i++) {
						if (attach[i].subject.search(reg) != -1) {
							searchIndex.push(i);
						}
					}
					break;
				case 'from':
					for (var i = 0; i < attach.length; i++) {
						if (attach[i].from.search(reg) != -1) {
							searchIndex.push(i);
						}
					}
					break;
				case 'to':
					for (var i = 0; i < attach.length; i++) {
						if (attach[i].to.search(reg) != -1) {
							searchIndex.push(i);
						}
					}
					break;
				case 'date':case 'size':
					return ; //not need
			}
		}
		changePage.style.display = "none";
		searchPage.style.display = "";
		searchPageNum = 0;
		doSearchPage();
		var attTitle = document.getElementById("attTitle");
		attTitle.innerHTML = attTitle.innerHTML.split('(')[0] + "(" + searchIndex.length + ")";
	} else {
		//alert("!");
		pageNum = 0;
		page();
		var attTitle = document.getElementById("attTitle");
		attTitle.innerHTML = attTitle.innerHTML.split('(')[0] + "(" + attach.length + ")";
		searchFlag = false;
		changePage.style.display = "";
		searchPage.style.display = "none";
	}
}


//添加附件
function submitModal() {
	if (selected.length == 0) {
		return;
	}
	body.removeChild(document.getElementById("divBack"));
	body.removeChild(document.getElementById("divmodal"));
	var loading = document.createElement("div");
	loading.setAttribute("class", "KA Kj-JD picker-dialog");
	loading.setAttribute("id", "loadingModal");
	loading.setAttribute("role", "dialog");
	loading.setAttribute("style", "margin:0px auto; width:180px; height:22px;overflow:auto; left:45%; top:0px; background: #fff1a8; border-color: #f9edbe; overflow:auto; font-size:20px;");
	loading.innerHTML = "创建邮件中...";
	body.appendChild(loading);
	chrome.extension.sendMessage({
		cmd: "draft",
		attachs: selected
	}, function(response) {
		loading.innerHTML = "创建成功...";
		setTimeout(function() {
			body.removeChild(document.getElementById("loadingModal"));
		}, 5000);
	});
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

function showKey() {
	var keyword = document.getElementById('keyword');
	if (keyFlag == 1)
		keyword.value = '';
}

function disKey() {
	var keyword = document.getElementById('keyword');
	if (!keyword.value) {
		keyword.value = '要搜索的附件...';
		keyFlag = 1;
	} else
		keyFlag = 0;
}

//排序显示
function reshow() {
	var searchTable = document.getElementById('attTable');
	var i, row, ch;
	var checkedIndex = new Array();
	for (i = searchTable.rows.length - 1; i > 0; i--) {
		//alert(i + " " + searchTable.rows[i].cells[2].innerHTML);
		ch = searchTable.rows[i];
		if (ch.cells[0].children[0].checked) {
			checkedIndex.push(parseInt(ch.id.split('tt')[1]))
		}
		searchTable.deleteRow(i);
	}
	if (sortFlag) {
		for (i = 0; i < sort.length; i++) {
			row = addAtt(attach[sort[i].index]);
			row.id = "att" + sort[i].index;
		}
	} else {
		for (i = sort.length - 1; i >= 0; i--) {
			row = addAtt(attach[sort[i].index]);
			row.id = "att" + sort[i].index;
		}
	}
	if (!searchFlag) {
		//alert("show");
		pageNum = 0;
		page();
	} else {
		//alert("search");
		searchPageNum = 0;
		doSearchPage();
	}
	//alert(sortCell.length + "!");
	sortFlag = !sortFlag;
	//alert(sortFlag);
	//alert(checkedIndex);
	for (i = 0; i < checkedIndex.length; i++) {
		//alert(checkedIndex[i]);
		ch = document.getElementById('att' + checkedIndex[i]);
		ch.cells[0].children[0].checked = true;
	}
}

function bubbleSort() {
	var i, j;
	var temp, string;
	for (i = 0; i < sort.length - 1; i++)
		for (j = i + 1; j < sort.length; j++)
			if (sort[i].key > sort[j].key) {
				//alert(i + ' ' + j);
				temp = sort[i];
				sort[i] = sort[j];
				sort[j] = temp;
			}
			/*var string = '';
			for (i = 0; i < sort.length; i++)
				string += sort[i].index + ' ' + sort[i].key + '\n';
			alert(string);*/
	reshow();
}

function doSort(sortKey) {
	var i;
	var searchTable = document.getElementById('attTable');
	sort.splice(0, sort.length);
	for (i = 1; i < searchTable.rows.length; i++) {
		var row = searchTable.rows[i];
		var sortNode = {
			index: parseInt(row.id.split('tt')[1]),
			key: row.cells[sortKey].innerHTML
		}
		if (sortKey == 7)
			sortNode.key = attach[sortNode.index].size;
		else if (sortKey == 0) {
			sortNode.key = row.cells[sortKey].children[0].checked;
		}
		sort.push(sortNode);
	}
	bubbleSort();
}

function choseSort() {
	//alert("chose");
	doSort(0);
}

function typeSort() {
	//alert("type");
	doSort(1);
}

function nameSort() {
	//alert("name");
	doSort(2);
}

function subjectSort() {
	//alert("subject");
	doSort(3);
}

function fromSort() {
	//alert("from");
	doSort(4);
}

function toSort() {
	//alert("to");
	doSort(5);
}

function dateSort() {
	//alert("date");
	doSort(6);
}

function sizeSort() {
	//alert("size");
	doSort(7);
}