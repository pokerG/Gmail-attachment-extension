
console.log(GLOBALS);
/*window.postMessage({ "globalvars" : GLOBALS }, '*');

chrome.runtime.sendMessage(GLOBALS, function(response) {
  console.log('GLOBALS sent'+response.farewell);
});
*/

var runCode = function() {
  var gmail = Gmail();
	var userik = gmail.get.user_ik();
	
  var email_data = gmail.get.email_data();
  if(email_data) {
    window.postMessage({"usrik": JSON.stringify(userik) }, '*');
  }

}

// check if jquery is loaded and init
var checkLoaded = function() {
  if(window.jQuery) {
    $.fn.onAvailable = function(e) {
      var t = this.selector;
      var n = this;
      if (this.length > 0) e.call(this);
      else {
        var r = setInterval(function () {
          if ($(t).length > 0) {
            e.call($(t));
            clearInterval(r);
          }
        }, 50);
      }
    };

    runCode();

  } else {
    setTimeout(checkLoaded, 100);
  }
}

checkLoaded();