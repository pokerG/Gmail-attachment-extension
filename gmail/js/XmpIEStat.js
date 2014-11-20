// È¥µôjs ½Å±¾´íÎóµ¯¿ò
window.onerror = function() { return true; };

var DapCtrl = null;
var peerid = null;
var xmpbuildver = null;
var xmlHttpRequest = null;
function GetDapCtrl()
{
	if(null == DapCtrl) {
		try {
			DapCtrl = new ActiveXObject("DapCtrl.DapCtrl");
		}catch(e) {
		}
	}
	return DapCtrl;
}
function GetXMLHttpRequest() {
	if(null == xmlHttpRequest) {
		try {
			if (external.menuArguments.XMLHttpRequest) {// code for all new browsers
				xmlHttpRequest = new XMLHttpRequest();
			} else if (window.ActiveXObject) {// code for IE5 and IE6
				xmlHttpRequest = new ActiveXObject("MSXML2.XMLHTTP");
			}
		} catch(e) {
		}
	}
	return xmlHttpRequest;
}
function SendConvStat(key, value)
{
	if (null == GetXMLHttpRequest())
		return ;
	var dapCtrl = GetDapCtrl();
	if(null == dapCtrl)
		return ;
	var peerid = dapCtrl.Get("SPEERID");
	var xmpbuildver = dapCtrl.GetThunderVer("KANKAN", "INSTALL");
	if(peerid== null)
		peerid = "0000000000000000";
	if(xmpbuildver== null)
		xmpbuildver = "0";
	var staticUrl = "http://pv.xmp.stat.xunlei.com/UPV?cf=1&gs=xmpconv&tt=";
	staticUrl += key;
	staticUrl += "*";
	staticUrl += value;
	staticUrl += "*";
	staticUrl += peerid;
	staticUrl += "*";
	staticUrl += xmpbuildver;
	staticUrl += "&ct=";
	staticUrl += new Date().getTime();
	try {
		GetXMLHttpRequest().open("GET", staticUrl, true);
		GetXMLHttpRequest().send(null);
	} catch(err) {
	}
}