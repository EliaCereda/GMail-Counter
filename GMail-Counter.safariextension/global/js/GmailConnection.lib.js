(function () {
    var GmailConnection = this.GmailConnection = new Class({
		Implements: [Options, Events],
		
		options: {
			baseURL: "https://mail.google.com/mail/",
			label: "inbox",
			
			onAvailableDataUpdate: null
		},
		
		updateState: 'notStarted',
		loginState: 'unknown',
		
		initialize: function (options) {
			this.setOptions(options);
			
			this.update();
		},
		
		generateURL: function (feed, query, anchor) {
			var url = this.options.baseURL;
			url += (feed) ? "feed/atom/" + ((this.options.label)? this.options.label : "") : "";

			url += (query) ? "?"+query : "";

			url += (anchor) ? "#"+anchor : "";
			
			return url;
		},
		
		update: function () {
			this.updateState = 'loginState'
			this.checkLoginState();
		}.
		
		checkLoginState: function static() {
			if (!static.request) { //Referring to the function to achieve static behavior (and avoid concurrent requests)
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
				}.bind(this, static.request))
			}
			static.request.send();
		}
	});
}());
