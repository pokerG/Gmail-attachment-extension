var usrik	//every email address have an unique ik 

window.onload = function () {	

	var jq = document.createElement('script');
  jq.src = chrome.extension.getURL('js/jquery-1.11.1.min.js');
  document.getElementsByTagName('body')[0].appendChild(jq)

  var sm = document.createElement('script');
  sm.src = chrome.extension.getURL('js/gmail.min.js');
  document.getElementsByTagName('body')[0].appendChild(sm);

	var sm = document.createElement('script');
  sm.src = chrome.extension.getURL('js/getik.js');
  document.getElementsByTagName('body')[0].appendChild(sm);
	
	window.addEventListener("message", function(event) {
	
    if(event.data.usrik) {
    	usrik = event.data.usrik
		console.log(usrik);

    }
  }, false);
}



