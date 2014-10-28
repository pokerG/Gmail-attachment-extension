/*
 * 版权所有 Copyright @ 胡争辉 Hu Zhenghui
 * “脚本扩展”插件包含两个主要功能，其一是汉化原型中的英文界面。其二是运行符合规范撰写了JavaScript脚本代码的部件
 */
(function(){
	$(function(){
		$('#interfaceControlFrameHeader a, #linkscontainer span, #linkscontainer a').text(function(index, content) {
			switch (content) {
				case 'Sitemap':
					return '站点地图';
				case 'Page Notes':
					return '页面注释';
				case 'Link with sitemap':
					return '包含站点地图的链接';
				case 'Link without sitemap - ':
					return '不包含站点地图的链接 - ';
				case 'link':
					return '链接';
			}
		});
		var togglelinks = function () {
			if ($('#linkscontainer').is(":visible")) {
      	$('#togglelinks').html('隐藏链接');
			} else {
				$('#togglelinks').html('显示链接');
			}
		};
		togglelinks();
		$('#togglelinks').click(togglelinks);
		$axure.player.createPluginHost({
			id: 'javascriptHost',
			content: 'interface',
			title: '脚本扩展'
		});
		$('<div></div>').css('font-size', '0.75em').append($('<input type="radio" name="javascriptAutoRun" checked />'), '手动运行页面脚本扩展').appendTo('#javascriptHost');
		var autoRun = $('<input type="radio" name="javascriptAutoRun" />');
		$('<div></div>').css('font-size', '0.75em').append(autoRun, '自动运行页面脚本扩展').appendTo('#javascriptHost');
		var unitCountElement = $('<span></span>').css('font-size', 'larger');
		$('<div></div>').css('font-size', '0.75em').append('本页共有', unitCountElement, '个部件').appendTo('#javascriptHost');
		var JSAnnCountElement = $('<span></span>').css('font-size', 'larger');
		$('<div></div>').css('font-size', '0.75em').append('本页共有', JSAnnCountElement, '个脚本扩展').appendTo('#javascriptHost');
		var manualRun = $('<button/>').text('手动运行本页脚本扩展').appendTo('#javascriptHost');
		var JSAnnListElement = $('<ol></ol>').css('font-size', '0.75em').css('list-style', 'decimal inside').appendTo('#javascriptHost');
		var JSAnnName = {
			JSLoad: '加载'
		};
		$('<div/>').css('font-size', '0.75em').append($('<a/>').attr('target', '_blank').attr('href', 'http://study.hpx-party.org/index.php?tutorial=4').text('脚本扩展在线帮助')).appendTo('#javascriptHost');
		var JSAnnList;
		var unitLabelList;
		var runJavaScript = function () {
			for (var i = 0; i < JSAnnList.length; i++) {
				var JSContent = eval("$('#mainFrame')[0].contentWindow.u" + JSAnnList[i]['unit'] + "Ann['" + JSAnnList[i]['annName'] + "']");
				JSContent = JSContent.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/<BR>/g, '\n');
				switch (JSAnnList[i]['annName']) {
					case 'JSLoad':
						eval('(function(unitId){' + JSContent + '})(' + JSAnnList[i]['unit'] + ')');
				}
			}
			manualRun.attr('disabled', 'disabled').text('已运行本页面脚本扩展');
		}
		manualRun.click(runJavaScript);
		$axure.page.bind('load.javascript', function() {
			if ($axure.page.pageName !== $('#mainFrame')[0].contentWindow.PageName) {
				return;
			}
			var unitCount = 0;
			while('object' === typeof(eval("$('#mainFrame')[0].contentWindow.u" + unitCount))) {
				unitCount++;
			}
			unitCountElement.text(unitCount);
			JSAnnList = new Array();
			unitLabelList = new Array();
			for (var i = 0; i < unitCount; i++) {
				var unitAnn = eval("$('#mainFrame')[0].contentWindow.u" + i + 'Ann');
				if ('object' === typeof(unitAnn)) {
					for (var annName in unitAnn) {
						if ('string' === typeof(JSAnnName[annName])) {
							JSAnnList.push({
								unit: i,
								annName: annName
							});
						} else if ('label' === annName) {
							unitLabelList[i] = unitAnn[annName];
						}
					}
				}
			}
			JSAnnCountElement.text(JSAnnList.length);
			var javascriptHeader = $('#interfaceControlFrameHeader li a[pluginid="javascriptHost"]');
			if (0 === JSAnnList.length) {
				if ('' !== javascriptHeader.attr('highlight')) {
					javascriptHeader.attr('highlight', '');
					javascriptHeader.fadeOut(function () {
						javascriptHeader.css('background-color', '').fadeIn();
					});
				}
				manualRun.attr('disabled', 'disabled').text('本页面不包含脚本扩展');
			} else {
				if ('yes' !== javascriptHeader.attr('highlight')) {
					javascriptHeader.attr('highlight', 'yes');
					javascriptHeader.fadeOut(function () {
						javascriptHeader.css('background-color', 'yellow').fadeIn();
					});
				}
				if (true == autoRun.attr('checked')) {
					runJavaScript();
				} else {
					manualRun.removeAttr('disabled').text('手动运行本页脚本扩展');
				}
			}
			JSAnnListElement.empty();
			for (var i = 0; i < JSAnnList.length; i++) {
				$('<li></li>').append(unitLabelList[JSAnnList[i]['unit']], ' - ', JSAnnName[JSAnnList[i]['annName']]).appendTo(JSAnnListElement);
			}
		});/*$axure.page.bind*/
	});/*document.onLoad*/
})();/*隔离变量空间*/
