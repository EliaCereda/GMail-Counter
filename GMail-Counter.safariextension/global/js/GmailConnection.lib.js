(function () {
    var GmailConnection = this.GmailConnection = new Class({
		Implements: [Options, Events],
		
		options: {
			baseURL: "https://mail.google.com/mail/",
			label: "inbox",
			userAccount: null,
			
			onAvailableDataUpdate: null
		},
		
		updateState: 'notInited', //checkLoginState, downloadFeed,, updateCompleted, updateFailed
		loginState: 'unknown',
		
		rawFeed: null,
		
		initialize: function (options) {
			this.setOptions(options);
			
			this.update();
		},
		
		generateURL: function (feed, query, anchor) {
			var url = this.options.baseURL;
			
			url += (this.options.userAccount)? "u/"+this.options.userAccount+"/" : "";
			
			url += (feed) ? "feed/atom/" + this.options.label || "" : "";

			url += (query) ? "?" + query : "";

			url += (anchor) ? "#" + anchor : "";
			
			return url;
		},
		
		update: function () {
			this.updateState = 'checkLoginState';
			this.checkLoginState(function () {
				if (this.loginState == 'login') {
					this.updateState = 'downloadFeed';
					this.downloadFeed(function () {
						if (this.rawFeed != null) {
							this.updateState = 'parseFeed';
						}
					});
				}
			}.bind(this));
		},
		
		checkLoginState: function static(onComplete) {
			if (!static.request) { //Referring to the function to avoid concurrent requests
				static.request = new Request({
					url: this.generateURL(false, "view=nonExistingView"),
					method: "get"
				});
				
				static.request.addEvent("complete", function(request) {
						if (request.status == '404' || request.status == '503') {
							this.loginState = 'login';
						} else if (request.status == '200') {
							this.loginState = 'logout';
						} else {
							this.loginState = 'unknown';
						}

						this.fireEvent('availableDataUpdate', ['loginState']);
						
						if (typeOf(onComplete) == 'function') {
							onComplete();
						}
				}.bind(this, static.request))
			}
			static.request.send();
		},
		
		downloadFeed: function static(onComplete) {
			if (!static.request) { //Referring to the function to avoid concurrent requests
				static.request = new Request({
					url: this.generateURL(true),
					method: "get",
					
					onRequest: function () {
						this.rawFeed = null;
					}.bind(this),
					onSuccess: function (responseText, responseXML){
						this.rawFeed = responseXML;
					}.bind(this),
					onComplete: function () {
						this.fireEvent('availableDataUpdate', ['rawFeed']);
						
						if (typeOf(onComplete) == 'function') {
							onComplete();
						}
					}.bind(this)
				});
			}
			static.request.send();
		},
		
		parseFeed: function(onComplete)
	});
}());
