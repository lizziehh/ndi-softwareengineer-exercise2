/**
 * @fileoverview
 * Provides methods for the Hello Endpoints sample UI and interaction with the
 * Hello Endpoints API.
 *
 * @author danielholevoet@google.com (Dan Holevoet)
 */

/** google global namespace for Google projects. */
var google = google || {};

/** devrel namespace for Google Developer Relations projects. */
google.devrel = google.devrel || {};

/** samples namespace for DevRel sample code. */
google.devrel.samples = google.devrel.samples || {};

/** hello namespace for this sample. */
google.devrel.samples.hello = google.devrel.samples.hello || {};

/**
 * Client ID of the application (from the APIs Console).
 * 
 * @type {string}
 */
// google.devrel.samples.hello.CLIENT_ID =
google.devrel.samples.hello.CLIENT_ID = '562215312828-ddct3rjmbq2vicmoaf1kt5r6lf4k8gq7.apps.googleusercontent.com';

/**
 * Scopes used by the application.
 * 
 * @type {string}
 */
google.devrel.samples.hello.SCOPES = 'https://www.googleapis.com/auth/userinfo.email';

/**
 * Whether or not the user is signed in.
 * 
 * @type {boolean}
 */
google.devrel.samples.hello.signedIn = false;

/**
 * Loads the application UI after the user has completed auth.
 */
google.devrel.samples.hello.userAuthed = function() {
	var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
		if (!resp.code) {
			google.devrel.samples.hello.signedIn = true;
			document.getElementById('signinButton').innerHTML = 'Sign out';
			document.getElementById('listGreetings').disabled = false;
			document.getElementById('testCase').disabled = false;

			google.devrel.samples.hello.setupData();
		}
	});
};

/**
 * Handles the auth flow, with the given value for immediate mode.
 * 
 * @param {boolean}
 *            mode Whether or not to use immediate mode.
 * @param {Function}
 *            callback Callback to call on completion.
 */
google.devrel.samples.hello.signin = function(mode, callback) {
	gapi.auth.authorize({
		client_id : google.devrel.samples.hello.CLIENT_ID,
		scope : google.devrel.samples.hello.SCOPES,
		immediate : mode
	}, callback);
};

/**
 * Presents the user with the authorization popup.
 */
google.devrel.samples.hello.auth = function() {
	if (!google.devrel.samples.hello.signedIn) {
		google.devrel.samples.hello.signin(false,
				google.devrel.samples.hello.userAuthed);
	} else {
		google.devrel.samples.hello.signedIn = false;
		document.getElementById('signinButton').innerHTML = 'Sign in';
		document.getElementById('listGreetings').disabled = true;
		document.getElementById('testCase').disabled = true;
	}
};

/**
 * Lists greetings via the API.
 */
google.devrel.samples.hello.listGreetings = function() {
	return gapi.client.helloworld.greetings.listGreetings();
};

google.devrel.samples.hello.createGreeting = function(message) {
	return gapi.client.helloworld.greetings.createGreeting({
		'message' : message
	});
};

google.devrel.samples.hello.deleteGreeting = function(key) {
	return gapi.client.helloworld.greetings.deleteGreeting({
		'key' : key
	});
};

google.devrel.samples.hello.deleteAllGreetings = function() {
	return gapi.client.helloworld.greetings.deleteAllGreetings();
};


google.devrel.samples.hello.findGreetingByMessage = function(message) {
	return gapi.client.helloworld.greetings.findGreetingByMessage({
		'message' : message
	});
}

google.devrel.samples.hello.updateGreeting = function(greeting) {
	return gapi.client.helloworld.greetings.updateGreeting(greeting);
};

google.devrel.samples.hello.getGreetingByKey = function(key) {
	return gapi.client.helloworld.greetings.getGreetingByKey({
		'key' : key
	});
}

/**
 * Enables the button callbacks in the UI.
 */
google.devrel.samples.hello.enableButtons = function() {

	document.getElementById('listGreetings').onclick = function() {
		google.devrel.samples.hello.listGreetings().then(function(resp) {
			google.devrel.samples.hello.setupData();
			google.devrel.samples.hello.printResults('list', resp.result);
		});
	}
	
	document.getElementById('testCase').onclick = function() {
		google.devrel.samples.hello.findGreetingByMessage('Hello Elizabeth!').then(function(resp) {
			var greetingsToElizabeth = resp.result;
			
			google.devrel.samples.hello.printResults('findGreetingByMessage', greetingsToElizabeth);
			if(!greetingsToElizabeth || !greetingsToElizabeth.items || greetingsToElizabeth.items.length < 1) {
				google.devrel.samples.hello.printLog('test case failed!!');
				//google.devrel.samples.hello.printLog('xtt');
				return;
			}
			//google.devrel.samples.hello.printLog('base nya test = ' + greetingsToElizabeth.items.length);
			
			for(var i = 0; i < greetingsToElizabeth.items.length; i++) {
				//greetingToElizabeth.message = 'Hello Eileen!';
				//console.log(greetingToElizabeth);
				console.log('============================');
				console.log(greetingsToElizabeth.items[i]);
				google.devrel.samples.hello.updateGreeting(greetingsToElizabeth.items[i]).then(function(resp) {
					var greetingToEileen = resp.result;
					console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuu');
					console.log(greetingToEileen);
					console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuu');
					google.devrel.samples.hello.printResult('updateGreeting', greetingToEileen);
					if(!greetingToEileen) {
						google.devrel.samples.hello.printLog('test case failed!!');
						//google.devrel.samples.hello.printLog('Y');
						return {
							then : function(f) {
								// f is ignored.
							}
						}
					}
					return google.devrel.samples.hello.getGreetingByKey(greetingToEileen.key);
				}).then(function(resp) {
					var greetingToEileen = resp.result;
					console.log(resp.result);
					console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
					console.log(greetingToEileen);
					google.devrel.samples.hello.printResult('getGreetingByKey', greetingToEileen);
					if(greetingToEileen && greetingToEileen.message === 'Hello Eileen!') {
						google.devrel.samples.hello.printLog('test case passed!!');
					} else {
						google.devrel.samples.hello.printLog('test case failed!!');
						//google.devrel.samples.hello.printLog('z');
					}
				});
			}
		});
	}
	
	document.getElementById('signinButton').onclick = function() {
		google.devrel.samples.hello.auth();
	}

};

/**
 * Initializes the application.
 * 
 * @param {string}
 *            apiRoot Root of the API's path.
 */
google.devrel.samples.hello.init = function(apiRoot) {
	// Loads the OAuth and helloworld APIs asynchronously, and triggers login
	// when they have completed.
	var apisToLoad;
	var callback = function() {
		if (--apisToLoad == 0) {
			google.devrel.samples.hello.enableButtons();
			google.devrel.samples.hello.signin(true,
					google.devrel.samples.hello.userAuthed);
		}
	}

	apisToLoad = 2; // must match number of calls to gapi.client.load()
	gapi.client.load('helloworld', 'v1', callback, apiRoot);
	gapi.client.load('oauth2', 'v2', callback);
};

/**
 * Prints a greeting to the greeting log. param {Object} greeting Greeting to
 * print.
 */
google.devrel.samples.hello.printLog = function(msg) {
	var element = document.createElement('div');
	element.classList.add('row');
	element.innerHTML = msg;
	document.getElementById('outputLog').appendChild(element);
};

google.devrel.samples.hello.printOperationLog = function(op, greeting) {
	google.devrel.samples.hello.printLog(op + ': ' + greeting.message + ' (' + greeting.key + ')');
};

google.devrel.samples.hello.printResult = function(op, result) {
	google.devrel.samples.hello.printOperationLog(op + ': ', result);
}

google.devrel.samples.hello.printResults = function(op, result) {
	if(!result || !result.items || result.items.length < 1) {
		google.devrel.samples.hello.printLog(op + ': no items found.');
		return;
	} 
	for (var i = 0; i < result.items.length; i++) {
		google.devrel.samples.hello.printOperationLog(op + '[' + i + ']',
				result.items[i]);
	}
}

google.devrel.samples.hello.setupData = function() {

	google.devrel.samples.hello.printLog('Start setting up data....');

	google.devrel.samples.hello.deleteAllGreetings().then(function(resp) {
		google.devrel.samples.hello.printResults('deleteAll', resp.result);
		return google.devrel.samples.hello.createGreeting('Hello Albert!');
	}).then(function(resp) {
		google.devrel.samples.hello.printResult('create', resp.result);
		return google.devrel.samples.hello.createGreeting('Hello Barbara!');
	}).then(function(resp) {
		google.devrel.samples.hello.printResult('create', resp.result);
		return google.devrel.samples.hello.createGreeting('Hello Cindy!');
	}).then(function(resp) {
		google.devrel.samples.hello.printResult('create', resp.result);
		return google.devrel.samples.hello.createGreeting('Hello David!');
	}).then(function(resp) {
		google.devrel.samples.hello.printResult('create', resp.result);
		return google.devrel.samples.hello.createGreeting('Hello Elizabeth!');
	}).then(function(resp) {
		google.devrel.samples.hello.printResult('create', resp.result);
		return google.devrel.samples.hello.createGreeting('Hello Frank!');
	}).then(function(resp) {
		google.devrel.samples.hello.printResult('create', resp.result);

		google.devrel.samples.hello.printLog('Finished setting up data!!');
	});
}
