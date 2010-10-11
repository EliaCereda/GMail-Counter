Global = {
	
	mailsCount: 0, //Number of unreaded mails
	mailsArray: [], //Array of latest 20 unreaded mails
	
	currentIndex: 0, //The current mail index in the mailsArray
	
	init: function () {
		safari.extension.bars.forEach(function(item) {
			ExtensionBar = item.contentWindow.ExtensionBar;
			
			if (typeof(ExtensionBar) != 'undefined' || typeof(ExtensionBar.activate) != 'undefined') {
				ExtensionBar.activate();
			}
		});
	},
	
	processActivation: function (caller) {
		console.warn(caller)
		caller.activate()
	},
	
	validate: function(event) {
		if (event.command === "button") {
			
			GMail.checkLogin(Global.callback);
		}
	},
	
	command: function(event) {
		Global.openLink(GMail.GMailBaseURL(false));
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
		openIn = safari.extension.settings.getItem("openIn");
		
		var _tab = null;
		
		switch ( openIn ) {
			case "newTab":
				_tab = safari.application.activeBrowserWindow.openTab();
			break;
	
			case "GMailTab":
				var _window = null;
				
				safari.application.browserWindows.forEach(function(a) {
					a.tabs.forEach(function(b) {
						if(GMail.isGMailURL(b.url)) {
							_window=a;
							_tab=b;
						}
					});
				});
				
				_window = (_window === null) ? safari.application.activeBrowserWindow : _window;
				_tab =  (_tab === null) ? safari.application.activeBrowserWindow.openTab() : _tab;
				
				_window.activate();
				_tab.activate();
			break;
			
			case "activeTab":
				_tab = safari.application.activeBrowserWindow.activeTab;
			break;
		}
		_tab.url=link;
	}
}

safari.application.addEventListener("validate", Global.validate, false);
safari.application.addEventListener("command", Global.command, false);

window.onload=Global.init;
//safari.extension.settings.addEventListener("change", change, false);