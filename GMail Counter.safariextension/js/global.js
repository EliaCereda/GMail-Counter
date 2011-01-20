/*
--------------------------------
	global.css
	Author: Elia Cereda
	Copyright (c) 2010-2011
	
	Global page Javascript file
--------------------------------
	Version History:
		* 0.8 - Initial release
		
--------------------------------

This file is part of Safari's Extension "GMail Counter" and is licensed under the MIT license.
Copyright (c) 2010-2011 Elia Cereda.
*/
var Storage = safari.extension.settings || {};

Global = {
	
	mailsCount: 0, //Number of unreaded mails
	mailsArray: [], //Array of latest 20 unreaded mails
	
	currentIndex: 0, //The current mail index in the mailsArray
	updateState: false, //True if it's updating else false
	
	latestFirstId: null,
	
	barChangeActiveTimeout: "", //The container for the Timeout reference
	
	init: function () {		
		safari.extension.bars.forEach(function(item) {
			var a = item.contentWindow.ExtensionBar.activate || function (){};
			a();
		});
	},
	
	processActivation: function (caller) {
		caller.activate()
	},
	
	processUpdate: function(forceUpdate) {
		if (Global.updateState == false || forceUpdate){
			Global.updateState = true;
			Global.BarSetUpdateState();
			GMail.checkLogin(Global.callback);
		}
	},
	
	validate: function(event) {
		if (event.command === "button") {
			Global.processUpdate();
		}
	},
	
	command: function(event) {
		Global.openLink(GMail.GMailBaseURL(false, false, "#inbox"));
	},
	
	change: function (e) {
		switch ( e.key ) {
			case "hideWhenNoMails":
				if(!e.newValue) {
					Global.BarToggle("show", true);
				} else {
					Global.processUpdate(true);
				}
			break;
			
			case "label":
			case "appsDomain":
				Global.processUpdate(true);
			break;
		}
		
		switch ( e.key ) {
			case "openIn":
			case "audioState":
			case "audioVolume":
			case "audioSrc":
			case "barTimeout":
			case "hideWhenNoMails":
			case "closeBehavior":
				GMailCounter.value(e.key, e.newValue);
		}
	},
	
	callback: function (sender, message) {
		switch ( sender ) {
			case "checkLogin":
				if (message === true) {
					GMail.updateFeed(Global.callback);
				} else {
					Global.updateState = false;
					Global.BarSetUpdateState();
					
					Global.loadData();
				}
			break;
			
			case "updateFeed":
				if (message != "error" && message !== null) {
					GMail.parseFeed(Global.callback);
				} else {
					Global.updateState = false;
					Global.BarSetUpdateState();
					
					Global.loadData();
				}
			break;
			
			case "parseFeed":
				Global.updateState = false;
				Global.BarSetUpdateState();
				
				switch ( message ) {
					case "noMails":
						Global.BarToggle("hide");
						Global.loadData();
					break;
					
					default:
						Global.BarToggle("show");
						Global.loadData();
					break;
				}
			break;
				
		}
	},
	
	loadData: function () {
		Global.mailsCount = GMail.getMailsCount();
		Global.previousMailsArray = Global.mailsArray;
		Global.mailsArray = GMail.getMailsArray();
		
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
		
		Global.sendNotification()
		
		var firstId = Global.mailsArray[0].id+Global.mailsArray[0].title+Global.mailsArray[0].author+Global.mailsCount;
		
		if (firstId != Global.latestFirstId) {
			
			Global.latestFirstId = firstId;
			Global.currentIndex = 0;
			
			Global.BarUpdate(true);
		}
	},

	openLink: function(link) {
		
		var _tab;
		
		switch ( Storage.openIn ) {
			case "newTab":
				_tab = safari.application.activeBrowserWindow.openTab();
			break;
			
			case "newWindow":
				_tab = safari.application.openBrowserWindow().activeTab;
			break;
			
			case "GMailTab":
				var _window;
				
				safari.application.browserWindows.forEach(function(a) {
					a.tabs.forEach(function(b) {
						if(GMail.isGMailURL(b.url)) {
							_window=a;
							_tab=b;
						}
					});
				});
				
				_window = _window || safari.application.activeBrowserWindow;
				_tab =  _tab || safari.application.activeBrowserWindow.openTab();
				
				_window.activate();
				_tab.activate();
			break;
			
			case "activeTab":
				_tab = safari.application.activeBrowserWindow.activeTab;
			break;
		}
		_tab.url=link;
	},
	
	BarToggle: function(action, forceToggle) {
		switch ( action ) {
			case "show":
				if (Storage.hiddenByMe || forceToggle) {
					Storage.hiddenByMe = false;
					
					safari.extension.bars.forEach(function(bar) {
						bar.show();
					});
				}
			break;
			
			case "hide":
				if(Storage.hideWhenNoMails || forceToggle) {
					Storage.hiddenByMe = true;
					
					safari.extension.bars.forEach(function(bar) {
						bar.hide();
					});
				}
			break;			
		}
	},
	
	BarUpdate: function(forceUpdate) {
		if(Global.mailsArray.length > 1 || forceUpdate) {
			safari.extension.bars.forEach(function(bar) {
				u = bar.contentWindow.ExtensionBar.update || function () {};
				u();
				
				clearTimeout(Global.barChangeActiveTimeout);
				Global.barChangeActiveTimeout = setTimeout(Global.BarNext, Storage.barTimeout*1000);
			});
		}
	},
	
	BarPrevious: function() {
		if(Global.currentIndex <= 0) {
			Global.currentIndex = Global.mailsArray.length-1;
		} else {
			Global.currentIndex--;
		}
		Global.BarUpdate();
	},
	
	BarNext: function() {
		if(Global.currentIndex >= Global.mailsArray.length-1) {
			Global.currentIndex = 0;
		} else {
			Global.currentIndex++;
		}
		Global.BarUpdate();
	},

	BarSetUpdateState: function() {
		safari.extension.bars.forEach(function(bar) {
				var s = bar.contentWindow.ExtensionBar.setUpdateState || function () {};
				s(Global.updateState);
		});
	},
	
	processBarClose: function(caller) {
		switch ( Storage.closeBehavior ) {
			case "closeActive":
				var h = caller.hide || function () {};
				h()
			break;
			
			default:
				safari.extension.bars.forEach(function(bar) {
						bar.hide();
				});
		}
	},
	
	sendNotification: function() {
		if(GMail.checkNewMails(true)) {
			if(Storage.audioState) {
				var sN = safari.extension.bars[0].contentWindow.ExtensionBar.sendNotification || function () {};
				sN();
			}
		}
	}
}

safari.application.addEventListener("validate", Global.validate, false);
safari.application.addEventListener("command", Global.command, false);

safari.extension.settings.addEventListener("change", Global.change, false);

window.addEventListener("load", Global.init);