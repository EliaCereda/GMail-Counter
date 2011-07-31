(function () {
    var GmailConnection = this.GmailConnection = new Class({
		Implements: [Options, Events],
		
		options: {
			baseURL: "https://mail.google.com",
			label: "inbox",
			userAccount: null,
			appsDomain: null,
			
			onUpdateComplete: null,
			onUpdateFailed: null,
		},
		
		updateState: 'init', //updating, updateCompleted, updateFailed
		loginState: 'unknown', //login, logout
		
		rawFeed: null,
		
		initialize: function (options) {
			this.setOptions(options);
			
			this.update();
		},
		
		generateURL: function (opts) {
			var url = this.options.baseURL;
			
			var domain = this.options.appsDomain;
			if (domain) {
				url += "/a/"+ domain + ((domain[domain.length - 1] != "/") ? "/" : "");
			} else {
				url +="/mail/";
			}
			
			url += (this.options.userAccount)? "u/"+this.options.userAccount+"/" : "";
			url += (opts.feed) ? "feed/atom/" + this.options.label || "" : "";
			url += (opts.query) ? "?" + opts.query : "";
			url += (opts.anchor) ? "#" + opts.anchor : "";
			
			return url;
		},
		
		update: function () {
			if (this.updateState != 'updating') {
				this.updateState = 'updating';
				
				var currentChain = new Chain;
				currentChain.chain(
					this.checkLoginState.bind(this),
					this.downloadFeed.bind(this),
					this.parseFeed.bind(this),
					
					this.updateComplete.bind(this)
				).callChain(currentChain, this.updateFailed.bind(this));
			}
		},
		
		checkLoginState: function (currentChain, fallback) {
			var request = new Request({
				url: this.generateURL({feed: false, query: "view=nonExistingView"}), //This will trigger a 404 error if you are logged in
				method: "get",
				
				timeout: 10,
				onTimeout: function () {
					this.loginState = 'unknown';
					if(fallback && typeOf(fallback) == "function") fallback({caller: "checkLoginState", reason: "timeout"});
				}.bind(this)
			});
			
			request.addEvent("complete", function(request) {
				switch (request.status) {
					case 404:
					case 503:
						this.loginState = 'login';
						break;
					case 200:
						this.loginState = 'logout';
						break;
					default:
						this.loginState = 'unknown';
						
						if(fallback && typeOf(fallback) == "function") fallback({caller: "checkLoginState", reason: "unknownResponse"});
						return;
				}
				if (currentChain && instanceOf(currentChain, Chain)) currentChain.callChain(currentChain, fallback);
			}.bind(this, request));
			
			request.send();
		},
		
		downloadFeed: function (currentChain, fallback) {
			if(this.loginState == 'login') {
				var request = new Request({
					url: this.generateURL({feed: true}),
					method: "get",
					timeout: 10,
				
					onSuccess: function (responseText, responseXML) {
						this.rawFeed = responseXML;
						if (currentChain && instanceOf(currentChain, Chain)) currentChain.callChain(currentChain, fallback);
					}.bind(this),
					onFailure: function (xhr) {
						this.rawFeed = null;
						if(fallback && typeOf(fallback) == "function") fallback({caller: "downloadFeed", reason: "XHRFailure"});
					}.bind(this),
					onTimeout: function () {
						this.rawFeed = null;
						if(fallback && typeOf(fallback) == "function") fallback({caller: "downloadFeed", reason: "timeout"});
					}.bind(this),
				}).send();
			}
		},
		
		parseFeed: function () {console.log("Parse")},
		
		updateComplete: function () {},
		updateFailed: function () {}
	});		
})();