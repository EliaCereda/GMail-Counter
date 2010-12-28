/*
--------------------------------
	global.css
	Author: Elia Cereda
	© 2010 All rights reserved.
	
	Global page Javascript file
--------------------------------
	Version History:
		* 0.8 - Initial release
		
--------------------------------

This file is part of Safari's Extension "GMail Counter", developed by Elia Cereda <cereda.extensions@yahoo.it>

If you redestribute, edit or share this file you MUST INCLUDE THIS NOTICE and you cannot remove it without prior written permission by Elia Cereda.
If you use this file or its derivates in your projects you MUST release it with this or any other compatible license.

This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
	Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
var Storage = safari.extension.settings;

Global = {
	
	mailsCount: 0, //Number of unreaded mails
	mailsArray: [], //Array of latest 20 unreaded mails
	
	currentIndex: 0, //The current mail index in the mailsArray
	updateState: false, //True if it's updating else false
	
	latestFirstId: null,
	
	barChangeActiveTimeout: "", //The container for the Timeout reference
	
	init: function () {		
		safari.extension.bars.forEach(function(item) {
			var ExtensionBar = item.contentWindow.ExtensionBar;
			
			if (typeof(ExtensionBar) == 'object' && typeof(ExtensionBar.activate) == 'function') {
				ExtensionBar.activate();
			}
		});
	},
	
	processActivation: function (caller) {
		caller.activate()
	},
	
	processUpdate: function(forceUpdate) {
		if (this.updateState == false || forceUpdate){
			this.updateState = true;
			this.BarSetUpdateState();
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
		this.mailsCount = GMail.getMailsCount();
		this.previousMailsArray = this.mailsArray;
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
		
		this.sendNotification()
		
		var firstId = this.mailsArray[0].id+this.mailsArray[0].title+this.mailsArray[0].author+this.mailsCount;
		
		if (firstId != this.latestFirstId) {
			
			this.latestFirstId = firstId;
			this.currentIndex = 0;
			
			this.BarUpdate(true);
		}
	},

	openLink: function(link) {
		
		var _tab = null;
		
		switch ( Storage.openIn ) {
			case "newTab":
				_tab = safari.application.activeBrowserWindow.openTab();
			break;
			
			case "newWindow":
				_tab = safari.application.openBrowserWindow().activeTab;
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
				bar.contentWindow.ExtensionBar.update();
				
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
				bar.contentWindow.ExtensionBar.setUpdateState(Global.updateState);
		});
	},
	
	processBarClose: function(caller) {
		switch ( Storage.closeBehavior ) {
			case "closeActive":
				caller.hide()
			break;
			
			default:
				safari.extension.bars.forEach(function(bar) {
						bar.hide();
				});
		}
	},
	
	sendNotification: function() {
		if(GMail.checkNewMails(true)) {
			if(Storage.audioState) safari.extension.bars[0].contentWindow.ExtensionBar.sendNotification();
		}
	}
}

safari.application.addEventListener("validate", Global.validate, false);
safari.application.addEventListener("command", Global.command, false);

safari.extension.settings.addEventListener("change", Global.change, false);

window.addEventListener("load", Global.init);