var google = new OAuth2('google', {
	client_id: '722713518095-tpo9ibi81nts4fhpgf415m1e84h4rddq.apps.googleusercontent.com',
	client_secret: 'BfodvtWGmuvP64FkH1lQWcoA',
	api_scope: 'https://www.googleapis.com/auth/gmail.readonly'
});

google.authorize(function() {

	
	
	var ATTACHMENT_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages/MessageId/attachments/AttId';

	var form = document.getElementById('form');
	var success = document.getElementById('success');
	var MsgList = null;
	var token = '';

	// Hook up the form to create a new task with Google Tasks
	form.addEventListener('submit', function(event) {
		event.preventDefault();

		fetchList();
	});



});

function fetchList() {
	var LIST_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages';
	var xhr = new XMLHttpRequest();
	//var msg = gapi.client.gmail.users.messages.get({"id":list.messages[i].id});
	xhr.onreadystatechange = function(event) {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {

				var list = JSON.parse(xhr.responseText);
				document.getElementById('taskid').innerHTML = '<br />';
				MsgList = list;

				//Fetch information of the attachments with a for loop
				for (var i = 0; i < list.messages.length; i++) {

					getMessage(list.messages[i].id);
				}
			} else {
				// Request failure: something bad happened
			}
		}
	};

	xhr.open('GET', LIST_FETCH_URL, true);

	xhr.setRequestHeader('Content-Type', 'application/json');
	token = google.getAccessToken();
	xhr.setRequestHeader('Authorization', 'OAuth ' + token);

	xhr.send(null);
}

function getMessage(MessageId) {
	var MESSAGE_FETCH_URL_prefix = 'https://www.googleapis.com/gmail/v1/users/me/messages/'; //messageId
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(event) {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {

				var messageObj = JSON.parse(xhr.responseText);
				console.log(messageObj.id);
				var parts = messageObj.payload.parts;

				//Fetch information of the attachments with a for loop
				for (var i = 0; i < parts.length; i++) {
					var part = parts[i];
					console.log(part.body.attachmentId);
				}

			} else {
				// Request failure: something bad happened
			}
		}
	};

	xhr.open('GET', MESSAGE_FETCH_URL_prefix + MessageId, true);

	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Authorization', 'OAuth ' + token);

	xhr.send(null);
}