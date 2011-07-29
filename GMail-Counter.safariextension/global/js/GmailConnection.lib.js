(function () {
    var GmailConnection = this.GmailConnection = new Class({
		Implements: [Options, Events],
		
		options: {
			baseURL: "https://mail.google.com/mail/",
			label: "inbox",
			onAvailableDataUpdate: function (){}
		},
		
		loginState: 'unknown',
		
		initialize: function (options) {
			this.setOptions(options);
		},
		
		generateURL: function (feed, query, anchor) {
			var url = this.options.baseURL;
			url += (feed) ? "feed/atom/" + ((this.options.label)? this.options.label : "") : "";

			url += (query) ? "?"+query : "";

			url += (anchor) ? anchor : "";
			
			return url;
		},
		
		checkLoginState: function static() {
			static.request = new Request({
				url: this.generateURL(false, "view=nonExistingView"),
				method: "get",
				onSuccess: function() {
					this.loginState = 'logout';
					this.fireEvent('availableDataUpdate', ['loginState']);
				}.bind(this),
				onFailure: function(xhr) {
					if (xhr.status == '404' || xhr.status == '503') {
						this.loginState = 'login';
					} else {
						this.loginState = 'unknown';
					}
					this.fireEvent('availableDataUpdate', ['loginState']);
				}.bind(this),
				onComplete: function(){
					console.log(this);
					console.log(self);
				}.bind(this)
			});
			static.request.send();
		}
	});
}());
