Global = {
	
	mailsCount: 0, //Number of unreaded mails
	mailsArray: [], //Array of latest 20 unreaded mails
	
	validate: function(event) {
		if (event.command === "button") {
			
			GMail.checkLogin(Global.callback);
		}
	},
	
	command: function(event) {
		openLink(GMail.GMailBaseURL(false));
	},
	
	callback: function (sender, message) {
		switch ( sender ) {
			case "checkLogin":
				if (message === true) {
					GMail.updateFeed(Global.callback);
				} else {
					Global.loadData();
				}
			break;
			
			case "updateFeed":
				if (message != "error" && message !== null) {
					GMail.parseFeed(Global.callback);
				} else {
					Global.loadData();
				}
			break;
			
			case "parseFeed":
				switch ( message ) {
					case "noNewMails":
						Global.checkNoNewMails(true);
					break;
					
					default:
						Global.loadData();
					break;
				}
			break;
				
		}
	},
	
	loadData: function () {
		this.mailsCount = GMail.getMailsCount();
		this.mailsArray = GMail.getMailsArray();
		
		safari.extension.toolbarItems.forEach(function(item) {
			if(item.command === "button") {
				if(Global.mailsCount != 0) {
					item.toolTip = "GMail Counter - "+Global.mailsCount+" new message"+(Global.mailsCount == 1?"":"s");
					item.badge = Global.mailsCount;
				} else {
					item.toolTip = "GMail Counter - No new messages";
					item.badge = 0;
				}
			}
		});
	},
	
	checkNoNewMails: function (shouldHide) {
		console.log(shouldHide);
	},

	openLink: function(link) {
		
	}
}

safari.application.addEventListener("validate", Global.validate, false);
safari.application.addEventListener("command", Global.command, false);
//safari.extension.settings.addEventListener("change", change, false);