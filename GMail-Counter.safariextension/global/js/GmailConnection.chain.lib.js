(function () {
    var GmailConnection = this.GmailConnection = new Class({
		Implements: [Options, Events],
		
		options: {
			baseURL: "https://mail.google.com/mail/",
			label: "inbox",
			userAccount: null,
			
			onUpdateComplete: null,
			onUpdateFailed: null,
		},
		
		updateState: 'updating', //updateCompleted, updateFailed
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
				url: this.generateURL(false, "view=nonExistingView"),
				method: "get",
				timeout: 10,
			});
			
			request.addEvent("complete", function(request) {
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
			
			if (currentChain) {
				currentChain.callChain(currentChain, fallback);
			}
		}.protect(),
		
		downloadFeed: function () {}.protect(),
		
		parseFeed: function () {}.protect()
	});		
})();