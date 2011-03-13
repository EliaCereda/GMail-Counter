/*
--------------------------------
	global.js
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
var store = GMailCounter.store || {};

Global = {
	
	mailsCount: 0, //Number of unreaded mails
	mailsArray: [], //Array of latest 20 unreaded mails
	previousMailsArray: [], //Array before last update
	
	currentIndex: 0, //The current mail index in the mailsArray
	updateState: false, //True if it's updating else false
	
	barChangeActiveTimeout: null, //The container for the Timeout reference
	
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
			Global.setUpdateState(true);
			
			GMail.checkLogin(Global.callback);
		}
	},
	
	processBarClose: function(caller) {
		safari.extension.bars.forEach(function(bar) {
				bar.hide();
		});
	},
	
	validate: function(e) {
		if (e.command === "button") {
			Global.processUpdate();
		}
	},
	
	command: function(e) {
		Global.openLink(GMail.GMailBaseURL(false, false, "#inbox"));
	},
	
	/*change: function (e) {
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
	},*/
	
	callback: function (sender, message) {
		switch ( sender ) {
			case "checkLogin":
				if (message === true) {
					GMail.updateFeed(Global.callback);
				} else {
				
					Global.setUpdateState(false);
					
					Global.loadData();
				}
			break;
			
			case "updateFeed":
				if (message != "error" && message !== null) {
					GMail.parseFeed(Global.callback);
				} else {
				
					Global.setUpdateState(false);
					
					Global.loadData();
				}
			break;
			
			case "parseFeed":
			
				Global.setUpdateState(false);
				
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
		
		switch ( GMail.checkNewMails() ) {
			case 1:
				Global.sendNotification()
			case -1:
				Global.currentIndex = 0;
				Global.BarUpdate(true);
			break;
		}
	},

	openLink: function(link) {
		
		var _tab;
		
		switch ( store.general.openLinksIn ) {
			case "newTab":
				_tab = safari.application.activeBrowserWindow.openTab();
			break;
			
			case "newWindow":
				_tab = safari.application.openBrowserWindow().activeTab;
			break;
			
			case "activeTab":
				_tab = safari.application.activeBrowserWindow.activeTab;
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
		}
		_tab.url=link;
	},
	
	setUpdateState: function(state) {
		safari.extension.bars.forEach(function(bar) {
				var s = bar.contentWindow.ExtensionBar.setUpdateState || void(0);
				s(state);
				Global.updateState = state;
		});
	},
	
	BarToggle: function(action, forceToggle) {
		switch ( action ) {
			case "show":
				if (store.hidden.BarHiddenByMe || forceToggle) {
					store.hidden.BarHiddenByMe = false; store.save();
					
					safari.extension.bars.forEach(function(bar) {
						bar.show();
					});
				}
			break;
			
			case "hide":
				if(store.HeadViewer.autoHide || forceToggle) {
					store.hidden.BarHiddenByMe = true; store.save();
					
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
				u = bar.contentWindow.ExtensionBar.update || void(0);
				u();
				
				clearTimeout(Global.barChangeActiveTimeout);
				Global.barChangeActiveTimeout = setTimeout(Global.BarNext, store.HeadViewer.interval*1000);
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
	
	sendNotification: function() {
		if(store.audio.enabled) {
			var sN = safari.extension.bars[0].contentWindow.ExtensionBar.sendNotification || void(0);
			sN();
		}
	}
}

safari.application.addEventListener("validate", Global.validate, false);
safari.application.addEventListener("command", Global.command, false);

//safari.extension.settings.addEventListener("change", Global.change, false);

window.addEventListener("load", Global.init);