
var PageName = '首页';
var PageId = '793bc67b0ca64272a63016fbdc1a48b8'
var PageUrl = '首页.html'
document.title = '首页';
var PageNotes = 
{
"pageName":"首页",
"showNotesNames":"False"}
var $OnLoadVariable = '';

var $CSUM;

var hasQuery = false;
var query = window.location.hash.substring(1);
if (query.length > 0) hasQuery = true;
var vars = query.split("&");
for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0].length > 0) eval("$" + pair[0] + " = decodeURIComponent(pair[1]);");
} 

if (hasQuery && $CSUM != 1) {
alert('Prototype Warning: The variable values were too long to pass to this page.\nIf you are using IE, using Firefox will support more data.');
}

function GetQuerystring() {
    return '#OnLoadVariable=' + encodeURIComponent($OnLoadVariable) + '&CSUM=1';
}

function PopulateVariables(value) {
    var d = new Date();
  value = value.replace(/\[\[OnLoadVariable\]\]/g, $OnLoadVariable);
  value = value.replace(/\[\[PageName\]\]/g, PageName);
  value = value.replace(/\[\[GenDay\]\]/g, '27');
  value = value.replace(/\[\[GenMonth\]\]/g, '10');
  value = value.replace(/\[\[GenMonthName\]\]/g, '十月');
  value = value.replace(/\[\[GenDayOfWeek\]\]/g, '星期一');
  value = value.replace(/\[\[GenYear\]\]/g, '2014');
  value = value.replace(/\[\[Day\]\]/g, d.getDate());
  value = value.replace(/\[\[Month\]\]/g, d.getMonth() + 1);
  value = value.replace(/\[\[MonthName\]\]/g, GetMonthString(d.getMonth()));
  value = value.replace(/\[\[DayOfWeek\]\]/g, GetDayString(d.getDay()));
  value = value.replace(/\[\[Year\]\]/g, d.getFullYear());
  return value;
}

function OnLoad(e) {

}

var u27 = document.getElementById('u27');
gv_vAlignTable['u27'] = 'center';
var u16 = document.getElementById('u16');

var u17 = document.getElementById('u17');
gv_vAlignTable['u17'] = 'center';
var u28 = document.getElementById('u28');

var u42 = document.getElementById('u42');

var u29 = document.getElementById('u29');
gv_vAlignTable['u29'] = 'center';
var u8 = document.getElementById('u8');

var u30 = document.getElementById('u30');

var u6 = document.getElementById('u6');

var u32 = document.getElementById('u32');

var u35 = document.getElementById('u35');
gv_vAlignTable['u35'] = 'center';
var u13 = document.getElementById('u13');

var u14 = document.getElementById('u14');
gv_vAlignTable['u14'] = 'center';
var u15 = document.getElementById('u15');

var u43 = document.getElementById('u43');
gv_vAlignTable['u43'] = 'center';
var u41 = document.getElementById('u41');

var u4 = document.getElementById('u4');

var u1 = document.getElementById('u1');

var u10 = document.getElementById('u10');

var u11 = document.getElementById('u11');
gv_vAlignTable['u11'] = 'center';
var u38 = document.getElementById('u38');

var u12 = document.getElementById('u12');

var u39 = document.getElementById('u39');
gv_vAlignTable['u39'] = 'center';
var u9 = document.getElementById('u9');
gv_vAlignTable['u9'] = 'center';
var u40 = document.getElementById('u40');

var u7 = document.getElementById('u7');

var u26 = document.getElementById('u26');

var u3 = document.getElementById('u3');

var u23 = document.getElementById('u23');

var u24 = document.getElementById('u24');

var u25 = document.getElementById('u25');
gv_vAlignTable['u25'] = 'center';
var u2 = document.getElementById('u2');
gv_vAlignTable['u2'] = 'top';
var u18 = document.getElementById('u18');

var u19 = document.getElementById('u19');

var u20 = document.getElementById('u20');
gv_vAlignTable['u20'] = 'center';
var u36 = document.getElementById('u36');

var u5 = document.getElementById('u5');
gv_vAlignTable['u5'] = 'top';
var u22 = document.getElementById('u22');

var u37 = document.getElementById('u37');
gv_vAlignTable['u37'] = 'center';
var u21 = document.getElementById('u21');

var u33 = document.getElementById('u33');
gv_vAlignTable['u33'] = 'center';
var u31 = document.getElementById('u31');
gv_vAlignTable['u31'] = 'center';
var u34 = document.getElementById('u34');

var u0 = document.getElementById('u0');

if (window.OnLoad) OnLoad();
