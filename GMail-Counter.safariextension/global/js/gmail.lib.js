(function () {
    var GmailConnection = this.GmailConnection = new Class({
		Implements: [Options, Events],
		
		options: {
			feedURL: "https://mail.google.com/mail/"
			onAvailableDataChange: function (){}
		},
		
		initialize: function () {
			this.setOptions(options);
		}
	});
}());
